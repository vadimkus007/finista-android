import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';

import moment from 'moment';

import { MaterialCommunityIcons as Icon, FontAwesome } from '@expo/vector-icons';

import { Loading } from '../../components/common';

import { getRequest } from '../../helpers';

import { 
    Menu, 
    MenuProvider, 
    MenuOptions, 
    MenuOption, 
    MenuTrigger, 
    MenuContext,
    renderers } from 'react-native-popup-menu';

import { RadioButton } from '../../components';

import deviceStorage from '../../services/deviceStorage';


const TradesScreen = (props) => {

    const [loading, setLoading] = useState(false);
    const [portfolio, setPortfolio] = useState({});
    const [trades, setTrades] = useState([]);
    const [sorted, setSorted] = useState('date');
    const [order, setOrder] = useState('ASC');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        deviceStorage.loadItemPromise('portfolio')
        .then(_portfolio => {
            setPortfolio(_portfolio);
            setLoading(true);
            _loadData(_portfolio.id);
        })
        .catch(err => {
            console.log(err);
            props.navigation.navigate('Portfolios');
        });
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
            /*
            if (order.toUpperCase() === 'ASC') {
                if (typeof a[key] === 'string') {
                    return a[key].localeCompare(b[key]);
                } else {
                    return a[key] - b[key];
                }
            } else {
                if (typeof b[key] === 'string') {
                    return b[key].localeCompare(a[key]);
                } else {
                    return b[key] - a[key];
                }
            }
            */
            if (order.toUpperCase() === 'ASC') {
                return a[key].localeCompare(b[key]);
            } 
            if (order.toUpperCase() === 'DESC') {
                return b[key].localeCompare(a[key]);
            }
            return 0;
        });
        setTrades(_trades);
    };

    const handleDeleteTrade = (trade) => {
        const endPoint = '/portfolio/trades/delete';
        postRequest(endPoint, trade)
        .then(result => {
            if (result.message) {
                console.log(result.message);
                _loadData(portfolio.id);
                return;
            }
            if (result.error) {
                if (result.error.name === 'SequelizeValidationError') {
                    result.error.errors.map(item => {
                        console.log('VALIDATION ERROR: ', item.message);
                    });
                } else {
                    console.log('SERVER ERROR: ', result.error);
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    const handleMenuSelect = (value) => {
        const {action, trade} = value;
        switch (action) {
            case 'edit': 
                props.navigation.navigate('TradeEdit', {trade: trade, refresh: refreshData});
                break;
            case 'delete':
                Alert.alert(
                    'ВНИМАНИЕ',
                    'Вы действительно хотите удалить сделку?',
                    [
                        {text: 'Да', onPress: (value) => {handleDeleteTrade(value)}},
                        {text: 'Нет'}
                    ]
                );
                break;
            default:
                break;
        };
    };

    const refreshData = () => {
        _loadData(portfolio.id);
    };

    const renderRow = (trade) => {

        const buy = [1];

        const getIconName = (group) => {
            const sharesGroup = ['Акция', 'Депозитарная расписка'];
            const etfGroup = ['ETF', 'ПИФ'];
            const bondsGroup = ['Облигация'];
            if (sharesGroup.includes(group)) {
                return 'book-multiple';
            } else if (etfGroup.includes(group)) {
                return 'newspaper';
            } else if (bondsGroup.includes(group)) {
                return 'bell-ring';
            } else {
                return 'cash-100';
            }
        };

        return (
            <View style={ styles.row } key={trade.id.toString()}>
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
                        <MenuOptions 
                            custonStyles =  {{
                                optionsContainer: {
                                    marginTop: 200,

                                }
                            }}
                            optionsContainerStyle={{ marginTop: -100 }}

                        >
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
            <View style={ {...styles.row, marginVertical: 10} } key={title}>
                <Text style={ styles.header }>{ title }</Text>
            </View>
        );
    };

    var currentSelector = null;

    const radioItems = [
        {
            label: <Text style={ {color: 'blue'} }>Все</Text>,
            value: 'all'
        },
        {
            label: <Text style={ {color: 'blue'} }>Акции</Text>,
            value: 'shares'
        },
        {
            label: <Text style={ {color: 'blue'} }>ETF</Text>,
            value: 'etf'
        },
        {
            label: <Text style={ {color: 'blue'} }>Об-ции</Text>,
            value: 'bonds'
        },
        {
            label: <Text style={ {color: 'blue'} }>Рубли</Text>,
            value: 'cashe'
        },
    ];

    const orderItems = [
        {
            label: <Icon name='arrow-down' color='blue' size = {18} />,
            value: 'ASC'
        },
        {
            label: <Icon name='arrow-up' color='blue' size = {18} />,
            value: 'DESC'
        }
    ];

    return (
        <MenuProvider>
        <ScrollView contentContainerStyle={ styles.container } >
            { !loading ? 
            <>
            <View style={ styles.filterContainer }>
                <RadioButton 
                    items= { radioItems } 
                    onSelected={(value) => {setFilter(value)}}
                />
            </View>

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
                <View style={ styles.orderContainer }>
                    <RadioButton 
                        items={ orderItems }
                        onSelected={ (value) => { setOrder(value) } }
                    />
                </View>
                <View style={{}}>
                    <TouchableOpacity onPress={ () => { props.navigation.navigate('TradeEdit') } } >
                        <Icon name='plus-circle' color='blue' size={38} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={ styles.tableContainer }>
                
                { trades.map((trade) => {

                    var output = [];
                    var show = false;

                    // filter records
                    switch (filter) {
                        case 'all' :
                            show = true;
                            break;
                        case 'shares':
                            if (trade.group === 'Акция' || trade.group === 'Депозитарная расписка') {
                                show = true;
                            };
                            break;
                        case 'etf':
                            if (trade.group === 'ПИФ' || trade.group === 'ETF') {
                                show = true;
                            };
                            break;
                        case 'bonds':
                            if (trade.group === 'Облигация') {
                                show = true;
                            }
                            break;
                        case 'cashe':
                            if (trade.group === null) {
                                show = true;
                            };
                            break;
                        default:
                            show = true;
                            break;
                    };

                    if (currentSelector !== trade[sorted]) {

                        currentSelector = trade[sorted];
                        output.push(renderHeader(currentSelector));

                    }

                    if (show) output.push(renderRow(trade));

                    return output;
                }
                )}

            </View>
            </>
            :
            <Loading size='large' />
            }
            <StatusBar style="auto" />
        </ScrollView>
        </MenuProvider>
    );

};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    filterContainer: {
        width: '100%',
        marginTop: 8,
        marginBottom: 8,
        padding: 10,
        paddingBottom: 0,
    },
    sortedContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        paddingBottom: 0,
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
        width: 180,
        borderWidth: 2,
        borderColor: 'blue',
        borderRadius: 10,
    },
    orderContainer: {
        width: 70,
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