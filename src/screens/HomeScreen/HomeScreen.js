import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { Button } from '../../components/common';

import deviceStorage from '../../services/deviceStorage';

const HomeScreen = (props) => {

    const logout = () => {
        deviceStorage.deleteJWT();
        props.navigation.navigate('Auth');
    };

    return (
        <View style={styles.container}>
            <Text>Open up App.js to start working on your app!</Text>
            <Button onPress={ logout }>
                Sign out
            </Button>
            <StatusBar style="auto" />
        </View>
    );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { HomeScreen };