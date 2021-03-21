import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from './components/common';

import { Auth } from './screens';

import deviceStorage from './services/deviceStorage';

export default function App() {

    const [jwt, setJwt] = useState('');

    const newJwt = (jwt) => {
        setJwt(jwt);
    };

    const loadJWT = () => {
        const value = deviceStorage.loadJWT();
        setJwt(value);
    };


    const logout = () => {
        deviceStorage.deleteJWT();
        setJwt('');
    };

    useEffect(() => {
        loadJWT();
    }, []);

    if (!jwt) {
        return (
            <Auth newJwt={newJwt} />
        );
    } else {
        return (
            <View style={styles.container}>
                <Text>Open up App.js to start working on your app!</Text>
                <Button onPress={ logout }>
                    Sign out
                </Button>
                <StatusBar style="auto" />
            </View>
        );
    }
      
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});