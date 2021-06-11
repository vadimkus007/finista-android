import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import { QuotesScreen } from '../screens/QuotesScreen';

export const QuotesStack = createStackNavigator({
    Quotes: QuotesScreen,
},{
    initialRootName: 'Quotes',
    navigationOptions: ({ navigation }) => ({
        title: 'Котировки',
    }),
    headerMode: 'none',
});