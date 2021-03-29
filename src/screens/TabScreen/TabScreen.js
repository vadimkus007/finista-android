import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import deviceStorage from '../../services/deviceStorage';

import { HomeScreen } from '../../screens/HomeScreen';

const SignoutScreen = () => {};

const style = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});



export const TabScreen = createBottomTabNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            tabBarLabel: 'Home',
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name='ios-home' color={tintColor} size={25} />
            )
        }
    },
    Signout: {
        screen: SignoutScreen,
        navigationOptions: {
            tabBarLabel: 'Signout',
            tabBarIcon: ({ tintColor }) => (
                <SimpleLineIcons name='logout' color={tintColor} size={20} />
            ),
            tabBarOnPress: ({ navigation }) => {
                deviceStorage.deleteJWT();
                navigation.navigate('Auth');
            }
        }
    },
},{
    tabBarOptions: {
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
        showIcon: true
    }
});
