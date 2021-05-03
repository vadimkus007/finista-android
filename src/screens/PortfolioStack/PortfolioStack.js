import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import { ActivesScreen } from '../../screens/ActivesScreen'; 
import { TradesScreen } from '../../screens/TradesScreen'; 
import { ProfitScreen } from '../../screens/ProfitScreen';
import { AnalyticsScreen } from '../../screens/AnalyticsScreen';


export const PortfolioStack = createMaterialTopTabNavigator({
    Actives: {
        screen: ActivesScreen,
        navigationOptions: {
            tabBarLabel: 'Активы',
            tabBarIcon: ({ tintColor }) => (
                <FontAwesome name='file-photo-o' color={tintColor} size={25} />
            ),
        }
    },
    Trades: {
        screen: TradesScreen,
        navigationOptions: {
            tabBarLabel: 'Сделки',
            tabBarIcon: ({ tintColor }) => (
                <FontAwesome name='handshake-o' color={tintColor} size={25} />
            ),
        }
    },
    Profit: {
        screen: ProfitScreen,
        navigationOptions: {
            tabBarLabel: 'Доходность',
            tabBarIcon: ({ tintColor }) => (
                <FontAwesome name='line-chart' color={tintColor} size={25} />
            ),
        }
    },
    Analytics: {
        screen: AnalyticsScreen,
        navigationOptions: {
            tabBarLabel: 'Аналитика',
            tabBarIcon: ({ tintColor }) => (
                <FontAwesome name='balance-scale' color={tintColor} size={25} />
            ),
        }
    },
},{
    initialRouteName: 'Actives',
    tabBarOptions: {
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
        showIcon: false,
        scrollEnabled: true,
        style: {
            backgroundColor: 'white'
        },
        indicatorStyle: {
            backgroundColor: 'blue'
        }
    },
});