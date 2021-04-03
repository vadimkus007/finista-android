import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const CalendarScreen = (props) => {

    return (
        <View style={ styles.container } >
            <Text>Calendar</Text>
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

export { CalendarScreen };