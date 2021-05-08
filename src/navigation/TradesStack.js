import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import { TradesScreen } from '../screens/TradesScreen';
import { TradeEditScreen } from '../screens/TradeEditScreen';

export const TradesStack = createStackNavigator({
    TradesList: TradesScreen,
    TradeEdit: TradeEditScreen
},{
    initialRootName: 'TradesList',
    navigationOptions: ({ navigation }) => ({
        title: 'Сделки',
    }),
    headerMode: 'none',
});

