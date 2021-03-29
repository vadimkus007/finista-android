import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Signin, Signup } from '../../components';


const AuthScreen = (props) => {

    const [showLogin, setShowLogin] = useState(true);

    const witchForm = () => {
        if (!showLogin) {
            return (
                <Signup authSwitch={ authSwitch } newJwt={ props.newJwt } />
            );
        } else {
            return (
                <Signin authSwitch={ authSwitch } newJwt={ props.newJwt } />
            );
        }
    };

    const switchScreen = () => {
        props.navigation.navigate(showLogin ? 'Signin' : 'Signup');
    }

    const authSwitch = () => {
        setShowLogin(!showLogin);
    };

    return (
        <View style={styles.container} >
            { witchForm() }
        </View>
    );

};

AuthScreen.navigationOptions = {
    header: null
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export { AuthScreen };