import React, { useState, useEffect } from 'react';
import { 
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';

import deviceStorage from '../../services/deviceStorage';

const AuthLoadingScreen = (props) => {

    _bootstrapAsync = async () => {
        const token = deviceStorage.loadJWT();
        props.navigation.navigate(token ? 'App' : 'Auth');
    }

    useEffect(() => {
        _bootstrapAsync();
    }, []);

    return (
        <View>
            <ActivityIndicator />
            <StatusBar barStyle="default" />
        </View>
    );

};

export { AuthLoadingScreen };