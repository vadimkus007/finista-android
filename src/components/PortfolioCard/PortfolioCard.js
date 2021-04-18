import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton } from 'react-native-cards';

import { FontAwesome, Entypo } from '@expo/vector-icons';

const PortfolioCard = ({ portfolio, onPress, onEditPress }) => {

    const { card, text } = styles;

    return (
        <Card style={ card }>
            <CardContent>
            <TouchableOpacity onPress={onPress}>
                <View style={styles.header}>
                    <View style={styles.headerText} >
                        <Text style={styles.headerText} >{ portfolio.title }</Text>
                    </View>
                    <View style={styles.headerButton}>
                        <TouchableOpacity onPress={ onEditPress } >
                            <FontAwesome name='edit' color='blue' size={18} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.row}>
                    <View>
                        <Text>Дата открытия</Text>
                    </View>
                    <View>
                        <Text>{portfolio.dateopen.slice(0,10)}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View>
                        <Text>Валюта портфеля</Text>
                    </View>
                    <View>
                        <Text>{portfolio.currency}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View>
                        <Text>Фиксированная комиссия</Text>
                    </View>
                    <View>
                        <Text>{ portfolio.comission + ' %' }</Text>
                    </View>
                </View>
            </TouchableOpacity>
            </CardContent>

        </Card>
    );
};

const cardBackgroundColor = '#e7f4f9';

const styles = StyleSheet.create({
    card: {
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 5,
        minHeight: 100,
        padding: 0,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: cardBackgroundColor,
    },
    text: {
        color: '#ff0000',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1, 
        marginBottom: 5
    },
    headerText: {
        fontSize: 18,
        fontWeight: '700',
    },
    headerButton: {
        marginTop: 5
    }
});



export { PortfolioCard };