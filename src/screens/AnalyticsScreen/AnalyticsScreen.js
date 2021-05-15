import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { List } from 'react-native-paper';

import { PieChart } from 'react-native-charts-wrapper';

import { Loading } from '../../components/common';

import deviceStorage from '../../services/deviceStorage';
import { getRequest } from '../../helpers';

const AnalyticsScreen = (props) => {

    const [loading, setLoading] = useState(false);
    const [portfolio, setPortfolio] = useState({});
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        deviceStorage.loadItemPromise('portfolio')
        .then(_portfolio => {
            setPortfolio(_portfolio);
        })
        .catch(err => {
            console.log(err);
            showMessage({ message: 'ERROR', description: err.message, type: 'danger' });
            props.navigation.navigate('Portfolios');
        });
    }, []);

    var legend = {
        enabled: true,
        textSize: 14,
        form: 'CIRCLE',
        position: 'RIGHT_OF_CHART',
        fontFamily: 'monospace',
        wordWrapEnabled: true
    };

    var data = {
        dataSets: [
            {
                yValues: [40, 21, 15, 9, 15],
                label: 'Pie dataset',
                config: {
                    sliceSpace: 5,
                    selectionShift: 13
                }
            },

        ],
        xValues: ['Sandwiches', 'Salads', 'Soup', 'Beverages', 'Desserts'],
    };

    var description = {
        text: 'This is Pie Chart description',
        textSize: 15,
        textColor: 'darkgrey',
        fontFamily: 'monospace',
        fontStyle: 2
    };

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
                        <Text>Section 1</Text>
                    </View>
                </List.Accordion>
                <List.Accordion
                    title="Портфель по типу активов"
                    style={ styles.accordion }
                    titleStyle={ styles.accordionTitle }
                >
                    <View style={ styles.row }>
                        <Text>Section 2</Text>
                    </View>
                </List.Accordion>
                <List.Accordion
                    title="Портфель акций"
                    style={ styles.accordion }
                    titleStyle={ styles.accordionTitle }
                >
                    <View style={ styles.row }>
                        <Text>Section 2</Text>
                    </View>
                </List.Accordion>
                <List.Accordion
                    title="Портфель ETF/ПИФ"
                    style={ styles.accordion }
                    titleStyle={ styles.accordionTitle }
                >
                    <View style={ styles.row }>
                        <Text>Section 2</Text>
                    </View>
                </List.Accordion>
                <List.Accordion
                    title="Портфель по секторам"
                    style={ styles.accordion }
                    titleStyle={ styles.accordionTitle }
                >
                    <View style={ styles.row }>
                        <Text>Section 2</Text>
                    </View>
                </List.Accordion>
                <List.Accordion
                    title="Доходность активов"
                    style={ styles.accordion }
                    titleStyle={ styles.accordionTitle }
                >
                    <View style={ styles.row }>
                        <Text>Section 2</Text>
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
});

export { AnalyticsScreen };