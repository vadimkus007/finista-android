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

const Signup = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { form, section, errorTextStyle } = styles;

    function signupUser(user) {
        const API_URL = SERVER_URL + '/signup';
        return fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(result => result.json());
    };

    function registerUser() {

        const user = {
            email,
            password,
            first_name,
            last_name
        };
        setError('');
        setLoading(true);
        signupUser(user)
        .then(response => {
            if (!response.token) {
                onRegisterFail(response.message);
                console.log(response);
            } else {
                deviceStorage.saveItem("token", response.token);
                props.newJwt(response.token);
            }
        })
        .catch(error => {

        });
    };

    function onRegisterFail(message) {
        setLoading(false);
        setError(message);
    }

    return (
        <Fragment>
        <View style={form}>
            <View style={ section } >
                <Input 
                    placeholder="E-mail"
                    label="Email"
                    value={ email }
                    onChangeText = { (email) => {setEmail(email)} }
                />
            </View>

            <View style={ section } >
                <Input 
                    secureTextEntry
                    placeholder="password"
                    label="Password"
                    value={ password }
                    onChangeText = { (password) => {setPassword(password)} }
                />
            </View>

            <View style={ section } >
                <Input 
                    placeholder="First Name"
                    label="First Name"
                    value={ first_name }
                    onChangeText = { (first_name) => {setFirstName(first_name)} }
                />
            </View>

            <View style={ section } >
                <Input 
                    placeholder="Last Name"
                    label="Last Name"
                    value={ last_name }
                    onChangeText = { (last_name) => {setLastName(last_name)} }
                />
            </View>

            <Text style={ errorTextStyle }>
                { error }
            </Text>

            { !loading ? 
                <Button onPress={registerUser}>
                    Signup
                </Button>
                :
                <Loading size={'large'} />

             }
        </View>

        <TextLink onPress={ props.authSwitch }>
            Already have an account? Signin!
        </TextLink>
        </Fragment>
    );
};

const styles = StyleSheet.create({
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

export { Signup };