import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';

import moment from 'moment';

import { MaterialCommunityIcons as Icon, FontAwesome } from '@expo/vector-icons';

import { Loading } from '../../components/common';

import { getRequest } from '../../helpers';

import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';


const TradesScreen = (props) => {

    const [loading, setLoading] = useState(false);
    const [portfolio, setPortfolio] = useState({});
    const [trades, setTrades] = useState([]);
    const [sorted, setSorted] = useState('date');
    const [order, setPrder] = useState('ASC');

    useEffect(() => {
        let _portfolio = props.navigation.getParam('portfolio');
        if (_portfolio) {
            setPortfolio(_portfolio);
            setLoading(true);
            _loadData(_portfolio.id);
        } else {
            props.navigation.navigate('Portfolios');
        };
    }, []);

    useEffect(() => {
        sortTrades(sorted, order);
    }, [sorted, order]);

    const _loadData = (portfolioId) => {
        const endPoint = '/portfolio/' + portfolioId + '/trades';
        getRequest(endPoint)
        .then(results => {
            if (results.error) {
                console.log(results.error);
            }
            setTrades(results.trades);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
        });
    };

    const sortTrades = (key, order = 'ASC') => {
        let _trades = trades;
        _trades.sort((a, b) => {
            if (order.toUpperCase() === 'ASC') {
                if (typeof a[key] === 'string') {
                    return b[key].localeCompare(a[key]);
                } else {
                    return b[key] - a[key];
                }
            } else {
                if (typeof a[key] === 'string') {
                    return a[key].localeCompare(b[key]);
                } else {
                    return a[key] - b[key];
                }
            }
            return 0;
        });
        setTrades(_trades);
    };

    const handleMenuSelect = (value) => {
        const {action, trade} = value;
        console.log(action, trade);
    };

    const renderRow = (trade) => {

        const buy = [1];

        const getIconName = (group) => {
            const sharesGroup = ['Акция', 'Депозитарная расписка'];
            const etfGroup = ['ETF', 'ПИФ'];
            const bondsGroup = ['Облигация'];
            if (sharesGroup.includes(group)) {
                return 'alpha-s-circle';
            } else if (etfGroup.includes(group)) {
                return 'alpha-e-circle';
            } else if (bondsGroup.includes(group)) {
                return 'alpha-b-circle';
            } else {
                return 'alpha-c-circle';
            }
        };

        return (
            <View style={ styles.row } key={trade.id}>
                <View style={ styles.cell }>
                    <Icon name={ getIconName(trade.group) } color={ buy.includes(trade.operationId) ? 'green' : 'red'  } size={36} />
                </View>
                <View style={ {...styles.cell, flex: 3, flexDirection: 'column', } }>
                    <Text style={{ fontSize: 16, width: '100%' }}>{ trade.secid }</Text>
                    <Text style={{ width: '100%', fontSize: 12 }}>
                        { trade.operation.title + ' ' + trade.amount + ' шт.' }
                    </Text>
                </View>
                <View style={ {...styles.cell, ...styles.right, flex: 3} } >
                    <Text style={{ fontSize: 16 }}>
                        { (Number(trade.price) * Number(trade.amount) + Number(trade.comission)).toFixed(2) + ' ' }
                        <FontAwesome name='ruble' size={14} color='black' />
                    </Text>
                </View>
                <View style={ {...styles.cell, ...styles.right} }>
                    <Menu 
                        onSelect={(value) => {handleMenuSelect(value)}}
                    >
                        <MenuTrigger>
                            <Icon name='dots-vertical' color='black' size={18} />
                        </MenuTrigger>
                        <MenuOptions optionsContainerStyle={{ marginTop: -200 }}>
                            <MenuOption value={{action: 'edit', trade: trade}}>
                                <Text>Редактировать</Text>
                            </MenuOption>
                            <MenuOption value={{action: 'delete', trade: trade}}>
                                <Text>Удалить</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>

                </View>
            </View>
        );
    };

    const renderHeader = (title) => {
        if (sorted === 'date') {
            title = moment(new Date(title)).format('DD.MM.YYYY');
        }
        return (
            <View style={ {...styles.row, marginVertical: 10} }>
                <Text style={ styles.header }>{ title }</Text>
            </View>
        );
    };

    var currentSelector = null;

    return (
        <ScrollView contentContainerStyle={ styles.container } >
            { !loading ? 
            <>
            <View style={ styles.sortedContainer }>
                <View style={ styles.pickerContainer }>
                    <Picker 
                        selectedValue = {sorted}
                        style={ styles.picker }
                        onValueChange = { (itemValue, itemIndex) => { setSorted(itemValue) }  }
                        mode='dropdown'
                        itemStyle={{ fontSize: 12 }}
                        itemTextStyle={{ fontSize: 12 }}
                        activeItemTextStyle={{ fontSize: 12 }}
                    >
                        <Picker.Item label='ПО ДАТЕ' value='date' />
                        <Picker.Item label='ПО ТИКЕРУ' value='secid' />
                    </Picker>
                </View>
            </View>

            <View style={ styles.tableContainer }>
                <MenuProvider>
                { trades.map((trade) => {
                    if (currentSelector !== trade[sorted]) {
                        currentSelector = trade[sorted];

                        return [renderHeader(currentSelector), renderRow(trade)];
                    };
                    return renderRow(trade);
                }
                )}
                </MenuProvider>
            </View>
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
    sortedContainer: {
        width: '100%',
        padding: 10,
        marginTop: 8,
        marginBottom: 8,
    },
    picker: {
        width: '100%',
        height: 28,
        color: 'blue',
        transform: [
            { scaleX: 0.9 },
            { scaleY: 0.9 }
        ],
    },
    pickerContainer: {
        width: 150,
        borderWidth: 2,
        borderColor: 'blue',
        borderRadius: 10,
    },
    tableContainer: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingVertical: 4,
    },
    cell: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 2,
    },
    right: {
        justifyContent: 'flex-end',
    },
    text: {
        fontSize: 14,
    },
    header: {
        fontWeight: '700',
        fontSize: 16,
        color: 'grey',
    },
});

export { TradesScreen };