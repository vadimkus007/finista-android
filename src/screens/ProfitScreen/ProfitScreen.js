import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

import { showMessage } from 'react-native-flash-message';

import { RadioButtonText } from '../../components';

import { Loading } from '../../components/common';

import deviceStorage from '../../services/deviceStorage';
import { getRequest } from '../../helpers';

const Ruble = () => {
    return (
        <FontAwesome name='ruble' size={14} color='#555' />
    );
};

const Divider = () => (
    <View style={ styles.divider }></View>
);

const ProfitScreen = (props) => {

    const { container, row, toolbar, text, header, headerText } = styles;

    const [loading, setLoading] = useState(false);
    const [portfolio, setPortfolio] = useState({});
    const [periods, setPeriods] = useState([]);

    const [tabs, setTabs] = useState([
        {value: 0, label: 'Весь период'}
    ]);
    const [tabSelected, setTabSelected] = useState(0);

    useEffect(() => {
        deviceStorage.loadItemPromise('portfolio')
        .then(_portfolio => {
            setPortfolio(_portfolio);
            setLoading(true);
            loadData(_portfolio.id);
        })
        .catch(err => {
            console.log(err);
            showMessage({ message: 'ERROR', description: err.message, type: 'danger' });
            props.navigation.navigate('Portfolios');
        });
    }, []);

    const loadData = (portfolioId) => {
        const endPoint = '/portfolio/' + portfolioId + '/profit';
        getRequest(endPoint)
        .then(data => {
            data.periods.forEach(row => {
                row.securities = sortArray(row.securities, 'DESC');
            });
            setPeriods(data.periods);
            updateTabs(data.periods);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            showMessage({ message: 'ERROR', description: err.message, type: 'danger' });
        });
    };

    const sortArray = (arr: array, order: string) => {
        if (order === 'ASC') {
            return arr.sort((a,b) => {
                return Number(a.profit) - Number(b.profit);
            });
        }
        if (order === 'DESC') {
            return arr.sort((a,b) => {
                return Number(b.profit) - Number(a.profit);
            });
        }
        return arr;
    };

    const updateTabs = (values) => {
        if (values.length > 0) {
            let _tabs = [];
            values.map((item, index) => {
                _tabs.push({value: index, label: item.title});
            });
            setTabs(_tabs);
        }
    };

    return (
        <ScrollView contentContainerStyle={ container } >
            { !loading ? 
            <>
            <View style={ toolbar }>
                <RadioButtonText 
                    items={ tabs }
                    onSelected={ (value) => { setTabSelected(value) } }
                />
            </View>
            <View style={ row }>
                <Text style={text}>Годовая доходность (XIRR)</Text>
                <Text style={text}>{ periods[tabSelected] ? periods[tabSelected].profit.toFixed(2) : '0.00' } %</Text>
            </View>
            <View style={ row }>
                <Text style={text}>Profit/Loss портфеля</Text>
                <Text style={text}>{ periods[tabSelected] ? periods[tabSelected].PL.toFixed(2) : '0.00' } <Ruble/></Text>
            </View>
            <Divider/>

            <View style={ row }>
                <Text style={text}>Начальный баланс</Text>
                <Text style={text}>{ periods[tabSelected] ? periods[tabSelected].startBalance.toFixed(2) : '0.00' } <Ruble/></Text>
            </View>
            <View style={ row }>
                <Text style={text}>Конечный баланс</Text>
                <Text style={text}>{ periods[tabSelected] ? periods[tabSelected].endBalance.toFixed(2) : '0.00' } <Ruble/></Text>
            </View>
            <Divider/>

            <View style={ row }>
                <Text style={text}>Комисии и др. расходы</Text>
                <Text style={text}>{ periods[tabSelected] ? periods[tabSelected].comission.toFixed(2) : '0.00' } <Ruble/></Text>
            </View>
            <Divider/>

            <View style={ row }>
                <Text style={text}>Пополнение</Text>
                <Text style={text}>{ periods[tabSelected] ? periods[tabSelected].income.toFixed(2) : '0.00' } <Ruble/></Text>
            </View>
            <View style={ row }>
                <Text style={text}>Вывод</Text>
                <Text style={text}>{ periods[tabSelected] ? periods[tabSelected].outcome.toFixed(2) : '0.00' } <Ruble/></Text>
            </View>
            <Divider/>

            <View style={ row }>
                <Text style={text}>Дивиденды</Text>
                <Text style={text}>{ periods[tabSelected] ? periods[tabSelected].dividends.toFixed(2) : '0.00' } <Ruble/></Text>
            </View>
            <Divider/>

            <View style={ header }>
                <Text style={ headerText }>Доходности бумаг за период (XIRR)</Text>
            </View>

            { periods[tabSelected] ? 
                periods[tabSelected].securities.map((item, index) => (
                <View style={ row } key={ item.secid }>
                    <Text style={text}>{ item.secid }</Text>
                    <Text style={text}>{ item.profit.toFixed(2) } %</Text>
                </View>
            ))
            :
            null
            }

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
        paddingHorizontal: 16,
    },
    row: {
        width: '100%',
        padding: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 0,
    },
    toolbar: {
        width: '100%',
        padding: 8,
        paddingHorizontal: 0,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    text: {
        fontSize: 16,
        color: '#555'
    },
    divider: {
        borderBottomWidth: StyleSheet.hairlineWidth*2,
        borderBottomColor: '#bfbfbf',
        width: '100%',
        padding: 2,
    },
    header: {
        width: '100%',
        padding: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 0,
        marginTop: 8,
        marginBottom: 8,
    },
    headerText: {
        fontSize: 18,
        color: '#999',
        fontWeight: '700',
    }
});

export { ProfitScreen };