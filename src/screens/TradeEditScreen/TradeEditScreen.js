import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import SearchableDropdown from 'react-native-searchable-dropdown';

import { RadioButton } from '../../components';

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

    return (
        <ScrollView contentContainerStyle={ styles.container } >
            <View style={ styles.row }>
                <View style={ styles.pickerContainer }>
                    <Picker 
                        selectedValue={ tradeType }
                        style={ styles.picker }
                        onValueChange = { (itemValue, itemIndex) => { setTradeType(itemValue) }  }
                    >
                        <Picker.Item label='Акции/ETF/ПИФ' value={0} />
                        <Picker.Item label='Облигации' value={1} />
                        <Picker.Item label='Деньги' value={2} />
                    </Picker>
                </View>
            </View>
            <View style={ styles.row }>
                <View style={ styles.pickerContainer }>
                    <Picker 
                        selectedValue={ trade.operationId }
                        style={ styles.picker }
                        onValueChange = { (itemValue, itemIndex) => { setTrade({...trade, operationId: itemValue}) } }
                    >
                    { operationsItems[tradeType].map((item) => (
                        <Picker.Item label={item.label} value={item.value} />
                    ))}
                    </Picker>
                </View>
            </View>
            <View style={ styles.row }>
                <Text style={ styles.label }>Тикер</Text>
                <SearchableDropdown 
                    items={ secids }
                    selectedItems={ {id: trade.secid} }
                    onItemSelect={ () => {} }
                    placeholder='Выберите тикер'
                    multi={false}
                    containerStyle={{ borderWidth: StyleSheet.hairlineWidth, borderColor: '#bfbfbf', padding: 4 }}
                    itemStyle={{ marginVertical: 10,  }}
                    itemsContainerStyle={{ padding: 8 }}
                />
            </View>
                <Text>{ tradeType }</Text>
                <Text>operationId = { trade.operationId } </Text>
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
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#bfbfbf',
    },
    picker: {
        width: '100%',
        height: 36,
    },
    label: {
        fontSize: 16,
    },
});

export { TradeEditScreen };