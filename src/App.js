import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack';

// import { Button } from './components/common';

import { AuthScreen } from './screens';
// import { HomeScreen } from './screens';
import { AuthLoadingScreen } from './screens';
import { Signin, Signup } from './components';
import { TabScreen } from './screens';

import FlashMessage from 'react-native-flash-message';

// import deviceStorage from './services/deviceStorage';

const AppStack = createStackNavigator({ 
    TabScreen:{
        screen: TabScreen,
        navigationOptions: {
            headerShown: false
        }
    },
});
const AuthStack = createStackNavigator({ Signin: Signin, Signup: Signup });

const AppContainer = createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: AuthLoadingScreen,
            App: AppStack,
            Auth: AuthStack
        },
        {
            initialRootName: 'AuthLoading'
        }
    )
);

const App = () => {
    return (
        <View style={{ flex: 1 }}>
            <AppContainer />
            <FlashMessage position="top" icon="auto" style={{ marginTop: 25 }}/>
        </View>
    );
};

export default App;
