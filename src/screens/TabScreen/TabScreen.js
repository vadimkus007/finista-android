import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, SimpleLineIcons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import deviceStorage from '../../services/deviceStorage';

import { HomeScreen } from '../../screens/HomeScreen';
import { DashboardScreen } from '../../screens/DashboardScreen';
import { QuotesScreen } from '../../screens/QuotesScreen';
import { PortfoliosScreen } from '../../screens/PortfoliosScreen';
import { CalendarScreen } from '../../screens/CalendarScreen';

const SignoutScreen = () => {};

const style = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});

const DashboardStack = createStackNavigator({ 
    Dashboard: {
        screen: DashboardScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Dashboard'
        })
    }
},
{
    navigationOptions: ({ navigation }) => ({
        tabBarLabel: 'Избранное',
        tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name='dashboard' color={tintColor} size={25} />
        ),
    })
});

const QuotesStack = createStackNavigator({
    Quotes: {
        screen: QuotesScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Quotes'
        })
    }
},{
    navigationOptions: ({ navigation }) => ({
        tabBarLabel: 'Котировки',
        tabBarIcon: ({ tintColor }) => (
            <Ionicons name='ios-bar-chart' color={ tintColor } size = {25} />
        ),
    })
});

const PortfoliosStack = createStackNavigator({ 
    Portfolios: {
        screen: PortfoliosScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Portfolios'
        })
    }
},
{
    navigationOptions: ({ navigation }) => ({
        tabBarLabel: 'Портфели',
        tabBarIcon: ({ tintColor }) => (
            <Ionicons name='briefcase' color={tintColor} size={25} />
        ),
    })
});

const CalendarStack = createStackNavigator({ 
    Calendar: {
        screen: CalendarScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Calendar'
        })
    }
},
{
    navigationOptions: ({ navigation }) => ({
        tabBarLabel: 'События',
        tabBarIcon: ({ tintColor }) => (
            <Ionicons name='calendar' color={tintColor} size={25} />
        ),
    })
});


export const TabScreen = createBottomTabNavigator({
    Dashboard: DashboardStack,
    Quotes: QuotesStack,
    Portfolios: PortfoliosStack,
    Calendar: CalendarStack,
    Signout: {
        screen: SignoutScreen,
        navigationOptions: {
            tabBarLabel: 'Выход',
            tabBarIcon: ({ tintColor }) => (
                <SimpleLineIcons name='logout' color={tintColor} size={20} />
            ),
            tabBarOnPress: ({ navigation }) => {
                deviceStorage.deleteJWT();
                navigation.navigate('Auth');
            },
        }
    },
},{
    tabBarOptions: {
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
        showIcon: true
    },
});

