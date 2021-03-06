import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const DashboardCard = ({ data, color, onPress }) => {
    const { card, highlight, regularText } = styles;

    return (
        <TouchableOpacity style={{ ...card, backgroundColor: color }} onPress={ onPress } >
            <View>
                <Text style={ highlight } >
                    { data.shortname }
                </Text>
            </View>
            <View>
                <Text style={ regularText }>
                    { data.last }
                </Text>
            </View>
            <View>
                <Text style={ regularText }>
                    { data.lasttoprevprice + ' %' }
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "gray",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingVertical: 10
    },
    highlight: {
        color: '#ffffff',
        fontWeight: '700'
    },
    regularText: {
        color: 'white'
    }
});

export { DashboardCard };