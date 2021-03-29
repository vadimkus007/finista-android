import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';


const HomeScreen = (props) => {

    return (
        <View style={styles.container}>
            <Text>Home screen!</Text>
            <StatusBar style="auto" />
        </View>
    );

};

HomeScreen.navigationOptions = {
    title: 'Home'
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