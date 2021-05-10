import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import {
    Input,
    Button,
    TextInput,
    Loading
} from '../../components/common';

import DatePicker from 'react-native-datepicker';

import { Dropdown } from 'react-native-material-dropdown-v2-fixed';

import { Picker } from '@react-native-picker/picker';

import { Entypo as Icon } from '@expo/vector-icons';

import deviceStorage from '../../services/deviceStorage';

import { postRequest } from '../../helpers';

import { showMessage } from 'react-native-flash-message';

const defaultPortfolio = {
    title: 'Default Portfolio',
    currency: 'RUB',
    comission: '0.00',
    dateopen: new Date().toISOString().slice(0,10),
    memo: '',
    userId: 1
};

const PortfolioEditScreen = (props) => {

    const [user, setUser] = useState({});
    const [portfolio, setPortfolio] = useState(defaultPortfolio);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const passedParam = props.navigation.getParam('portfolio', defaultPortfolio);

    const getUserId = async () => {
        var user = await deviceStorage.loadItem("user");
        if (user) {
            setUser(user);
            return user.id;
        }
    };

    useEffect(() => {
        setPortfolio(passedParam);
        getUserId();
    }, []);

    useEffect(() => {
        // setPortfolio({...portfolio, userId: user.id});
    },[user]);

    useEffect(() => {
        // console.log(portfolio);
    }, [portfolio]);

    function handleSubmit() {
        const endPoint = '/portfolios/save';
        postRequest(endPoint, portfolio)
        .then(result => {
            if (result.portfolio) {
                console.log('Portfolio saved', result.portfolio);
                showMessage({ message: 'Portfolio saved', type: 'success' });
                props.navigation.state.params.refresh();
                props.navigation.navigate('Portfolios');
                return;
            }
            if (result.message) {
                console.log('Portfolio saved with message', result.message);
                showMessage({ message: result.message, type: 'success' })
                props.navigation.state.params.refresh();
                props.navigation.navigate('Portfolios');
                return;
            }
        })
        .catch(err => {
            console.log(err);
            showMessage({ message: 'ERROR', description: err.message, type: 'danger' });
        });
        // alert(JSON.stringify(portfolio, null, 2));
    };

    return (
        <View style={styles.container}>
            <View style={ styles.form }>
                <View style={ styles.section }>
                    <TextInput 
                        placeholder="Название портфеля"
                        label="Название портфеля"
                        value={ portfolio.title }
                        onChangeText = { (title) => {setPortfolio({...portfolio, title: title})} }
                    />
                </View>
                <View style={ [styles.section, {flexDirection: 'column', }] }>
                    <Text style={{ fontSize: 16 }}>Валюта портфеля</Text>
                    <View style={ styles.pickerContainer }>
                        <Picker 
                            selectedValue={ portfolio.currency }
                            onValueChange = { (itemValue, itemIndex) => { setPortfolio({...portfolio, currency: itemValue}) }  }
                            style={{ flex: 1, height: 32, borderBottomColor: 'transparent', borderWidth: 0 }}
                        >
                            <Picker.Item label='Рубли' value='RUB'/>
                            <Picker.Item label='USD' value='USD'/>
                            <Picker.Item label='EUR' value='EUR'/>
                            <Picker.Item label='GBP' value='GBP'/>
                        </Picker>
                    </View>
                </View>
                <View style={ styles.section }>
                    <TextInput 
                        placeholder="Комиссия"
                        label="Комиссия по умолчанию, %"
                        value={ portfolio.comission }
                        onChangeText = { (comission) => {setPortfolio({...portfolio, comission: comission})} }
                    />
                </View>
                <View style={ styles.section }>
                    <Text style={{fontSize: 16}}>Дата открытия</Text>
                    <DatePicker
                        date={ portfolio.dateopen }
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
                            }
                        }}
                        onDateChange={ (date) => {setPortfolio({...portfolio, dateopen: date})} }
                    />
                </View>
                <View style={ styles.section }>
                    <TextInput
                        placeholder="Описание"
                        label="Описание"
                        value={ portfolio.memo }
                        onChangeText={ (memo) => {setPortfolio({...portfolio, memo: memo})} }
                    />
                </View>

                { !loading ?
                <Button onPress={ handleSubmit }>
                    Сохранить
                </Button>
                : 
                <Loading size={'large'} />
                }

            </View>
            <StatusBar style="auto" />
        </View>
    );

};

PortfolioEditScreen.navigationOptions = {
    title: 'Редактировать портфель'
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'flex-start',
    },
    form: {
        width: '100%',
    },
    section: {
        flexDirection: 'row',
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        padding: 8,
        alignItems: 'flex-start'
    },
    pickerContainer: {
        width: '100%',
        minHeight: 36,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
    },
    picker: {
        width: '100%',

    },
});

export { PortfolioEditScreen };