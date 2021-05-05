import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const PortfolioHeader = ({portfolio}) => {

    const { container, row, text } = styles;

    const getColor = (value) => {
        if (value > 0) {
            return 'lightgreen';
        } else if (value < 0) {
            return 'red';
        } else {
            return 'white';
        }
    };

    return (
        <View style={container} >
            <View style={row}>
                <Text style={text}>Стоимость портфеля</Text>
                <Text style={text}>{ Number(portfolio.cost).toFixed(2) }</Text>
            </View>
            <View style={ row }>
                <Text style={text}>Прибыль</Text>
                <Text style={ {...text, color: getColor(portfolio.profit)} }>{ Number(portfolio.profit).toFixed(2) }</Text>
            </View>
            <View style={ row }>
                <Text style={ text }>Изменение за день</Text>
                <Text style={ {...text, color: getColor(portfolio.change)} }>{ Number(portfolio.change).toFixed(2) } ({ Number(portfolio.changePrc).toFixed(2) }%)</Text>
            </View>
            <View style={ row }>
                <Text style={ text }>Годовая доходность</Text>
                <Text style={ {...text, color: getColor(portfolio.xirr)} }>{ Number(portfolio.xirr).toFixed(2) } %</Text>
            </View>
        </View>
    );
};

const headerBackgroundColor = '#0d1117';
const textColor = 'white';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: headerBackgroundColor,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        color: textColor,
        lineHeight: 30,
        fontWeight: '700',
    },
    number: {

    },
});

export { PortfolioHeader };
