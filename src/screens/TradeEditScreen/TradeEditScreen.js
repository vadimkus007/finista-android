import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import SearchableDropdown from 'react-native-searchable-dropdown';
import DatePicker from 'react-native-datepicker';
// import DropDownPicker from 'react-native-dropdown-picker';

import { RadioButton } from '../../components';
import { Button } from '../../components/common';

import deviceStorage from '../../services/deviceStorage';
import { getRequest, postRequest } from '../../helpers';

import { showMessage } from 'react-native-flash-message';

const operationsItems = [
        [
            {
                label: 'Покупка',
                value: 1,
            },
            {
                label: 'Продажа',
                value: 2,
            },
            {
                label: 'Дивиденд',
                value: 3,
            },
        ],
        [
            {
                label: 'Покупка',
                value: 7,
            },
            {
                label: 'Продажа',
                value: 8,
            },
            {
                label: 'Погашение',
                value: 4,
            },
            {
                label: 'Купон',
                value: 5,
            },
            {
                label: 'Амортизация',
                value: 6,
            },
        ],
        [
            {
                label: 'Внести',
                value: 1,
            },
            {
                label: 'Вывести',
                value: 2,
            },
        ]
    ];

const TradeEditScreen = (props) => {

    const [portfolio, setPortfolio] = useState({});
    const [trade, setTrade] = useState({
        id: '',
        portfolioId: '',
        secid: '',
        operationId: '1',
        date: new Date().toISOString().slice(0, 10),
        price: '',
        amount: '',
        value: '100',
        accint: '0',
        comission: '',
        comment: ''
    });

    const [tradeType, setTradeType] = useState(0);
    const [secids, setSecids] = useState([
        { id: 'AFLT', name: 'Aeroflot' },
        { id: 'GAZP', name: 'Gazprom' }
    ]);
    const [secidsServer, setSecidsServer] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const [valid, setValid] = useState(false);


    const getSecids = () => {
        const endPoint = '/securities';

        return new Promise((resolve, reject) => {
            getRequest(endPoint)
            .then(request => {
                let shares = [];
                let bonds = [];
                let rubles = [];

                request.securities.map((secid) => {
                    if (secid.group === 'Облигация') {
                        bonds.push({ id: secid.secid, name: secid.secid + ' (' + secid.name + ') ('+secid.group+')' });
                    } else {
                        shares.push({ id: secid.secid, name: secid.secid + ' (' + secid.name + ') ('+secid.group+')' });
                    }
                });
                rubles.push({id: 'RUB', secid: 'Рубли'});
                let final = [];
                final[0] = shares;
                final[1] = bonds;
                final[2] = rubles;
                resolve(final);
            })
            .catch(err => reject(err));
        });
    };

    const handleTradeType = (value) => {

        let _secid = (value === 2) ? 'RUB' : '';

        setTradeType(value);
        setTrade({...trade, 
            operationId: operationsItems[value][0].value,
            secid: _secid,
            amount: '1'
        });

    };

    const handleSelectSecid = (item) => {
        const {id, name} = item;
        setTrade({...trade, secid: id});
    };

    const handleSubmit = () => {
        postRequest('/portfolio/trades/save', trade)
        .then(result => {
            if (result.trade) {
                console.log('Trade saved successfully');
                showMessage({ message: 'Trade saved successfully', type: 'success' });
                props.navigation.state.params.refresh();
                props.navigation.navigate('TradesList');
                return;
            }
            if (result.message) {
                console.log(result.message);
                props.navigation.state.params.refresh();
                props.navigation.navigate('TradesList');
                return;
            }
            if (result.error) {
                if (result.error.name == 'SequelizeValidationError') {
                    result.error.errors.map(item => {
                        console.log('VALIDATION ERROR: ',item.message);
                        showMessage({ message: 'VALIDATION ERROR', description: item.message, type: 'danger' });
                    });
                } else {
                    console.log('SERVER ERROR', result.error);
                    showMessage({ message: 'ERROR', description: result.error, type: 'danger' });
                }
            }
        })
        .catch(err => {
            console.log(err);
            showMessage({ message: err.message, type: 'ganger' });
        });
    };

    const checkValid = () => {

        const isNumber = (value) => {
            return (String(Number(value)) === String(value)) ? true : false;
        };

        const isDate = (value) => {
            return (new Date(value).toISOString().slice(0,10) === value) ? true : false;
        };

        const isEmpty = (value) => {
            return (typeof value === 'undefined' || isNaN(value) || value === null || value === '') ? true : false;
        };

        const isPrice = (value) => {
            return (String(Number(value).toFixed(2)) === String(value)) ? true : false;
        };

        let _valid = true;
        if (!isEmpty(trade.secid)) {
            _valid = false;
        }
        if (isDate(trade.date)) {
            _valid = false;
        }
        if (!isNumber(trade.amount) || Number(trade.amount) < 1) {
            _valid = false;
        }
        if (!isPrice(trade.price)) {
            _valid = false;
        }
        setValid(_valid);
    };

    useEffect(() => {
        
        const _trade = props.navigation.getParam('trade');
        if (_trade) {
            if (_trade.group === 'Облигация') {
                setTradeType(1);
            } else if (_trade.group === null) {
                setTradeType(2);
            } else {
                setTradeType(0);
            }
            setTrade(_trade);
        }

        getSecids()
        .then(results => {
            setSecidsServer(results)
            setSecids(results[tradeType]);

            return deviceStorage.loadItemPromise('portfolio');

        })
        .then(_portfolio => {
            setPortfolio(_portfolio);
        })
        .catch(err => {
            console.log(err);
            showMessage({ message: err.message, type: 'danger' });
        });
        
    },[]);
        
    useEffect(() => {
        if (secidsServer.length > 0) {
            setSecids(secidsServer[tradeType]);
        }
    },[tradeType]);

    useEffect(() => {
        checkValid();
    }, [trade]);



    return (
        <ScrollView contentContainerStyle={ styles.container } keyboardShouldPersistTaps='handled'>
            <View style={ styles.row }>
                <View style={ styles.pickerContainer }>
                    <Picker 
                        selectedValue={ tradeType }
                        style={ styles.picker }
                        onValueChange = { (itemValue, itemIndex) => { handleTradeType(itemValue) }  }
                    >
                        <Picker.Item label='Акции/ETF/ПИФ' value={0} />
                        <Picker.Item label='Облигации' value={1} />
                        <Picker.Item label='Деньги' value={2} />
                    </Picker>
                </View>
            </View>
            <View style={ [styles.row, {flexDirection: 'row', justifyContent: 'space-between'}] }>
                <View style={ [styles.pickerContainer, {flex: 1}] }>
                    <Picker 
                        selectedValue={ trade.operationId }
                        style={ styles.picker }
                        onValueChange = { (itemValue, itemIndex) => { setTrade({...trade, operationId: itemValue}) } }
                    >
                    { operationsItems[tradeType].map((item) => (
                        <Picker.Item label={item.label} value={item.value} key={ item.label + item.value } />
                    ))}
                    </Picker>
                </View>
                <View style={{ flex: 1 }}>
                    <DatePicker
                    date={ trade.date }
                    mode="date"
                    placeholder="Select date"
                    format="YYYY-MM-DD"
                    confirmBtnText="OK"
                    cancelBtnText="Отмена"
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36,
                            borderRadius: 8,
                            borderColor: '#bfbfbf'
                        }
                    }}
                        onDateChange={ (date) => {setTrade({...trade, date: date})} }
                    />
                </View>
            </View>
            { tradeType !== 2 ?
            <>
            <View style={ styles.row }>
                <Text style={ styles.label }>Тикер</Text>
                <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <SearchableDropdown 
                        onItemSelect={ (item) => {
                            handleSelectSecid(item);
                        } }
                        onTextChange={ () => {} }
                        containerStyle= {{ 
                            flex: 2, 
                            marginRight: 10, 
                            backgroundColor: '#ccc',
                            borderWidth: StyleSheet.hairlineWidth*2,
                            borderRadius: 8,
                            borderColor: '#bfbfbf'
                        }}
                        textInputStyle={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 4

                        }}
                        itemStyle={{
                            padding: 2,
                            marginTop: 2,
                            backgroundColor: '#fff',
                            borderColor: 'transparent'
                        }}
                        itemTextStyle={{

                        }}
                        itemsContainerStyle={{
                            maxHeight: 140,
                            borderColor: '#bfbfbf',
                            borderWidth: StyleSheet.hairlineWidth,
                        }}
                        items={secids}
                        defaultIndex={0}
                        placeholder='Выберите тикер'
                        underlineColorAndroid="transparent"
                    />
                    <Text style={{ flex: 1, fontSize: 18, fontWeight: '700', color: 'blue' }}>{ trade.secid }</Text>
                </SafeAreaView>
            </View>
            <View style={ styles.row }>
                <Text style={ styles.label }>Количество</Text>
                <TextInput 
                    value={ String(trade.amount) }
                    onChangeText={ (value) => { setTrade({...trade, amount: value}) } }
                    keyboardType="numeric"
                    style={ styles.input }
                />
            </View>
            </>
            : 
            null 
            }
            <View style={ styles.row }>
                <Text style={ styles.label }>{(tradeType !== 2) ? 'Цена' : 'Сумма'}</Text>
                <TextInput 
                    value={ trade.price }
                    onChangeText={ (value) => { setTrade({...trade, price: value}) } }
                    keyboardType="numeric"
                    style={ styles.input }
                />
            </View>
            { tradeType === 1 ? 
            <>
            <View style={ styles.row }>
                <Text style={ styles.label }>Номинал, руб.</Text>
                <TextInput 
                    value={ trade.value }
                    onChangeText={ (value) => { setTrade({...trade, value: value}) } }
                    keyboardType="numeric"
                    style={ styles.input }
                />
            </View>
            <View style={ styles.row }>
                <Text style={ styles.label }>НКД, руб.</Text>
                <TextInput 
                    value={ trade.accint }
                    onChangeText={ (value) => { setTrade({...trade, accint: value}) } }
                    keyboardType="numeric"
                    style={ styles.input }
                />
            </View>
            </>
            :
            null
            }
            
            <View style={ styles.row }>
                <Text style={ styles.label }>Комиссия, руб.</Text>
                <TextInput 
                    value={ trade.comission }
                    onChangeText={ (value) => { setTrade({...trade, comission: value}) } }
                    keyboardType="numeric"
                    style={ styles.input }
                />
            </View>
            <View style={ styles.row }>
                <Text style={ styles.label }>Заметка</Text>
                <TextInput 
                    value={ trade.comment }
                    onChangeText={ (value) => { setTrade({...trade, comment: value}) } }
                    style={ styles.input }
                />
            </View>
            { valid ?
            <View style={ styles.row }>
                <Button onPress={ handleSubmit } >
                    Сохранить
                </Button>
            </View>
            :
            null
            }
            <View style={ styles.row }>
                <Button onPress={ () => {props.navigation.navigate('TradesList')} } >
                    Отменить
                </Button>
            </View>

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
    row: {
        width: '100%',
        padding: 8,
    },
    pickerContainer: {
        width: '100%',
        borderWidth: StyleSheet.hairlineWidth*2,
        borderColor: '#bfbfbf',
        borderRadius: 8,
    },
    picker: {
        width: '100%',
        height: 36,
    },
    label: {
        fontSize: 16,
    },
    input: {
        borderColor: '#bfbfbf',
        borderWidth: StyleSheet.hairlineWidth*2,
        borderRadius: 8,
        height: 36,
        paddingLeft: 5,
    }
});

export { TradeEditScreen };