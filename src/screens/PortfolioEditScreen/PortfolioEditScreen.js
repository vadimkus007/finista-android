import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import {
    Input,
    Button,
    TextInput
} from '../../components/common';

import deviceStorage from '../../services/deviceStorage';

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
                <View style={ styles.section }>
                    <TextInput 
                        placeholder="Валюта"
                        label="Валюта"
                        value={ portfolio.currency }
                        onChangeText = { (currency) => {setPortfolio({...portfolio, currency: currency})} }
                    />
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
                    <TextInput 
                        placeholder="Дата открытия"
                        label="Дата открытия"
                        value={ portfolio.dateopen.slice(0,10) }
                        onChangeText = { (date) => {setPortfolio({...portfolio, dateopen: date})} }
                    />
                </View>
                <View style={ styles.section }>
                    <TextInput
                        placeholder="Описание"
                        label="Описание"
                        value={ portfolio.memo }
                        onChangeText={ (memo) => {setPortfolio({...portfolio, memo: memo})} }
                        multiline={true}
                        numberOfLines={2}
                    />
                </View>

                <View style={ styles.section }>
                    <Text>{ portfolio.title }</Text>
                </View>

                <Button onPress={()=>{}}>
                    Сохранить
                </Button>

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
        padding: 8
    },
});

export { PortfolioEditScreen };