import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton } from 'react-native-cards';

import { FontAwesome } from '@expo/vector-icons';

const AddPortfolioCard = ({ onPress }) => {

    const { card, text } = styles;

    return (
        <Card style={ card }>
            <TouchableOpacity onPress={onPress} >
                <FontAwesome name='plus' color={'blue'} size={25} />
            </TouchableOpacity>
        </Card>
    );
}

const cardBackgroundColor = '#e7f4f9';

const styles = StyleSheet.create({
    card: {
        marginTop: 5,
        marginBottom: 5,
        padding: 10,
        borderRadius: 5,
        minHeight: 100,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: cardBackgroundColor,
    },
});



export { AddPortfolioCard };