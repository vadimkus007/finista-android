import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Signin, Signup } from '../../components';


const Auth = (props) => {

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

    const authSwitch = () => {
        setShowLogin(!showLogin);
    };

    return (
        <View style={styles.container} >
            { witchForm() }
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export { Auth };