import React, { useState, Fragment } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { 
    Input,
    TextLink,
    Button,
    Loading 
} from '../common';

import config from '../../config/config.json';

const SERVER_URL = config.SERVER_URL;

import deviceStorage from '../../services/deviceStorage'; 

const Signin = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { form, section, errorTextStyle } = styles;

    
    function signinUser(email, password) {
        const API_URL = SERVER_URL + '/signin';
        return fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
        .then(data => data.json());
    }
    

    function signin() {
        setError('');
        setLoading(true);
        signinUser(email, password)
        .then(response => {
            console.log(response);
            if (!response.user) {
                onSigninFail('Incorrect email or password');
            } else {
                deviceStorage.saveItem("token", response.token);
                deviceStorage.saveItem("user", response.user);
                // props.newJwt(response.token);
                props.navigation.navigate('App');
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    function onSigninFail(message) {
        setLoading(false);
        setError(message);
    }

    return (
        <View style={ styles.container } >
        <View style={ styles.form }>
            <View style={ styles.section } >
                <Input 
                    placeholder="E-mail"
                    label="Email"
                    value={ email }
                    onChangeText = { (email) => {setEmail(email)} }
                />
            </View>

            <View style={ styles.section } >
                <Input 
                    secureTextEntry
                    placeholder="password"
                    label="Password"
                    value={ password }
                    onChangeText = { (password) => {setPassword(password)} }
                />
            </View>

            <Text style={ styles.errorTextStyle }>
                { error }
            </Text>

            { !loading ? 
                <Button onPress={signin}>
                    Signin
                </Button>
                :
                <Loading size={'large'} />

             }
        </View>

        <TextLink onPress={ () => props.navigation.navigate('Signup') }>
            Don't have an account? Register!
        </TextLink>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    form: {
        width: '100%',
        borderTopWidth: 1,
        borderColor: '#ddd'
    },
    section: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#ddd'
    },
    errorTextStyle: {
        alignSelf: 'center',
        fontSize: 18,
        color: 'red'
    }
});

export { Signin };