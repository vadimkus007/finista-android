import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { List } from 'react-native-paper';

import { 
    BarChart as Bar,
    PieChart
 } from 'react-native-chart-kit';

import { 
    BarChart, 
    Grid,
    YAxis,
    XAxis 
} from 'react-native-svg-charts'

import { showMessage } from 'react-native-flash-message';

import { Loading } from '../../components/common';

import deviceStorage from '../../services/deviceStorage';
import { getRequest } from '../../helpers';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const barData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [-45, -20, 28, 80, 99, 43]
    }
  ]
};

const AnalyticsScreen = (props) => {

    const [loading, setLoading] = useState(false);
    const [portfolio, setPortfolio] = useState({});
    const [expanded, setExpanded] = useState(true);

    const [actives, setActives] = useState([]);
    const [activeTypes, setActiveTypes] = useState([]);
    const [shares, setShares] = useState([]);
    const [etf, setEtf] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [efficiency, setEfficiency] = useState([]);
    const [barData, setBarData] = useState([{label: '', data: 0}]);

    const getRandomColor = () => {

        const rand = () => {return Math.floor(Math.random() * 255)};

        return 'rgb('+String(rand())+','+String(rand())+','+String(rand())+',1)';
    };

    const getColor = (index) => {
        const colorsLib = [
            '#803E75', // Strong Purple
            '#FF6800', // Vivid Orange
            '#A6BDD7', // Very Light Blue
            '#C10020', // Vivid Red
            '#CEA262', // Grayish Yellow
            '#817066', // Medium Gray

            // The following don't work well for people with defective color vision
            '#007D34', // Vivid Green
            '#F6768E', // Strong Purplish Pink
            '#00538A', // Strong Blue
            '#FF7A5C', // Strong Yellowish Pink
            '#53377A', // Strong Violet
            '#FF8E00', // Vivid Orange Yellow
            '#B32851', // Strong Purplish Red
            '#F4C800', // Vivid Greenish Yellow
            '#7F180D', // Strong Reddish Brown
            '#93AA00', // Vivid Yellowish Green
            '#593315', // Deep Yellowish Brown
            '#F13A13', // Vivid Reddish Orange
            '#232C16', // Dark Olive Green
            '#FFB300', // Vivid Yellow
        ];

        let _index = index;
        while (_index > colorsLib.length-1) {
            _index = _index - colorsLib.length;
        };
        return colorsLib[_index];
    };

    const processData = (data) => {
        var _data = data.sort((a,b) => {
            return b.y - a.y;
        });
        let result = [];
        _data.map((item, index) => {
            let _item = item;
            if (_item.label) {
                _item.name = _item.name + ' ' + _item.label;
            }
            _item.color = getColor(index);
            _item.legendFontColor = "#7F7F7F";
            _item.legendFontSize = 15;
            result.push(_item);
        });
        return result;
    };

    const processBarData = (data) => {
        let results = [];
        data.map((item, index) => {
            results.push({label: item[0], data: item[1]});
        });
        // console.log(results);
        return results;
    };

    const processEfficiency = (data) => {
        let labels = [];
        let newData = [];
        data.map((item) => {
            labels.push(item[0]);
            newData.push(item[1]);
        });
        let result = {
            labels: labels,
            datasets: [
                {
                    data: newData,
                    withShadow: false,
                    color: 'rgba(255, 0, 0, 1)',
                }
            ]
        };
        return result;
    };
    
    useEffect(() => {
        deviceStorage.loadItemPromise('portfolio')
        .then(_portfolio => {
            setPortfolio(_portfolio);
            return getRequest(`/portfolio/${_portfolio.id}/analytics`);
        })
        .then(results => {
            console.log('efficiency', results.efficiency);
            setActives(processData(results.actives));
            setActiveTypes(processData(results.activeTypes));
            setShares(processData(results.shares));
            setEtf(processData(results.etf));
            setSectors(processData(results.sectors));
            setEfficiency(results.efficiency);
            // setEfficiency(processEfficiency(results.efficiency));
            setBarData(processBarData(results.efficiency));
        })
        .catch(err => {
            console.log(err);
            showMessage({ message: 'ERROR', description: err.message, type: 'danger' });
            props.navigation.navigate('Portfolios');
        });
    }, []);

    const chartConfig = {
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#08130D",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // optional
    };

    const barConfig = {
        backgroundGradientFrom: "#FFF",
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: "#FFF",
        backgroundGradientToOpacity: 1,
        fillShadowGradient: "#FF493B",
        fillShadowGradientOpacity: 1,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 3, // optional, default 3
        barPercentage: 0.3,
        useShadowColorFromDataset: false // optional
    };

    /************************************************/
    const fill = 'rgb(134, 65, 244)';

    /************************************************/

    
    return (
        <ScrollView contentContainerStyle={ styles.container } >
            { !loading ?
            <>
            <List.Section title='' style={ styles.section }>
                <List.Accordion
                    title="Портфель по активам"
                    style={ styles.accordion }
                    titleStyle={ styles.accordionTitle }
                >
                    <View style={ styles.row }>
                        <PieChart 
                            data={ actives }
                            width={ windowWidth - 30 }
                            height={200}
                            chartConfig={ {...chartConfig} }
                            accessor={'y'}
                            backgroundColor={'transparent'}
                            paddingLeft={'15'}
                        />
                    </View>
                </List.Accordion>
                <List.Accordion
                    title="Портфель по типу активов"
                    style={ styles.accordion }
                    titleStyle={ styles.accordionTitle }
                >
                    <View style={ styles.row }>
                        <PieChart 
                            data={ activeTypes }
                            width={ windowWidth - 30 }
                            height={200}
                            chartConfig={ chartConfig }
                            accessor={'y'}
                            backgroundColor={'transparent'}
                            paddingLeft={'15'}
                        />
                    </View>
                </List.Accordion>
                <List.Accordion
                    title="Портфель акций"
                    style={ styles.accordion }
                    titleStyle={ styles.accordionTitle }
                >
                    <View style={ styles.row }>
                        <PieChart 
                            data={ shares }
                            width={ windowWidth - 30 }
                            height={200}
                            chartConfig={ chartConfig }
                            accessor={'y'}
                            backgroundColor={'transparent'}
                            paddingLeft={'15'}
                        />
                    </View>
                </List.Accordion>
                <List.Accordion
                    title="Портфель ETF/ПИФ"
                    style={ styles.accordion }
                    titleStyle={ styles.accordionTitle }
                >
                    <View style={ styles.row }>
                        <PieChart 
                            data={ etf }
                            width={ windowWidth - 30 }
                            height={200}
                            chartConfig={ chartConfig }
                            accessor={'y'}
                            backgroundColor={'transparent'}
                            paddingLeft={'15'}
                        />
                    </View>
                </List.Accordion>
                <List.Accordion
                    title="Портфель по секторам"
                    style={ styles.accordion }
                    titleStyle={ styles.accordionTitle }
                >
                    <View style={ styles.row }>
                        <PieChart 
                            data={ sectors }
                            width={ windowWidth - 30 }
                            height={200}
                            chartConfig={ chartConfig }
                            accessor={'y'}
                            backgroundColor={'transparent'}
                            paddingLeft={'15'}
                        />
                    </View>
                </List.Accordion>
                <List.Accordion
                    title="Доходность активов"
                    style={ styles.accordion }
                    titleStyle={ styles.accordionTitle }
                >
                    <View style={ styles.row }>
                        <View style={ { height: 200, flexDirection: 'row' } }>
                            <YAxis 
                                data={ efficiency }
                                svg={{
                                   fill:'grey',
                                   fontSize: 10,
                                }}
                                contentInset={ styles.contentInset }
                                yAccessor={ ({item}) => item[1] }
                            />

                            <BarChart 
                                style={{ flex: 1, marginLeft: 10 }}
                                data={ efficiency }
                                svg={ {fill} }
                                contentInset={ styles.contentInset }
                                horizontal={ false }
                                yAccessor={ ({item}) => item[1] }
                                xAccessor={ ({item}) => item[0] }
                            >
                            
                                
                                <Grid direction={ Grid.Direction.HORIZONTAL } />
                            </BarChart>

                        </View>
                        <View style={{ flexDirection: 'row', height: 40 }}>
                            <XAxis
                                style={ { paddingVertical: 0, flex: 1, paddingLeft: 35, paddingRight: 5 } }
                                data={ efficiency }
                                formatLabel={ (value, index) => efficiency[index][0] }
                                svg={{
                                   fill: 'grey',
                                   fontSize: 10,
                                   rotation: 90,
                                   translateY: 15,
                                }}
                                xAcccessor={ ({item}) => item[0] }
                            />
                        </View>
                    </View>
                </List.Accordion>
            </List.Section>
            </>
            :
            <Loading size='large' />
            }
            <StatusBar style="auto" />
        </ScrollView>
    );

};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  section: {
    width: '100%',
    marginHorizontal: 0,
  },
  accordion: {
    width: '100%',
  },
  accordionTitle: {
    fontSize: 20,
  },
  row: {
    paddingHorizontal: 16,
  },
  chart: {
    flex: 1,
  },
  contentInset: {
    top: 20,
    bottom: 10,
  },
});



export { AnalyticsScreen };