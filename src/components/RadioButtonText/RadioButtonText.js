import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const button = (item) => {
    const {label, value} = item;
    return (
        <TouchableOpacity style={ styles.button } onPress={() => {console.log('Button pressed')}}>
            { label }
        </TouchableOpacity>
    );
};

const RadioButtonText = ({ items, onSelected }) => {

    const [radioItems, setRadioItems] = useState([]);
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        setRadioItems(items);
    }, []);

    const handleSelect = (key) => {
        setSelected(key);
        onSelected(radioItems[key].value);
    };

    return (
        <View style={ styles.container }>
            { radioItems.map((item, key) => 
                {
                    var buttonStyle = {...styles.button};
                    if (key === 0) {
                        buttonStyle = {...buttonStyle, ...styles.buttonFirst};
                    }
                    if (key === radioItems.length-1) {
                        buttonStyle = {...buttonStyle, ...styles.buttonLast};
                    }
                    buttonStyle = (key === selected) ? {...buttonStyle, ...styles.buttonSelected} : buttonStyle;
                    var textStyle = (key === selected) ? {...styles.textSelected} : {...styles.text}
                    return (
                        <TouchableOpacity key={key} style={ buttonStyle } onPress={ () => {handleSelect(key)} }>
                            <Text style={ textStyle }>{ item.label }</Text>
                        </TouchableOpacity>
                    );
                }
            ) }
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 32,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        minHeight: 32,
        alignItems: 'center',
        backgroundColor: boxActiveBgColor,
        color: '#03a9f4',
        borderWidth: 2,
        borderColor: 'blue',
        borderLeftWidth: 0,
    },
    buttonFirst: {
        borderLeftWidth: 2,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
    },
    buttonLast: {
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
    },  
    buttonActive: {

    },
    buttonDeactive: {

    },
    buttonSelected: {
        backgroundColor: 'blue',
    },
    text: {
        color: 'blue',
        fontWeight: '700',
    },
    textSelected: {
        color: '#fff',
        fontWeight: '700',
    },
});

const colors = {
    defaultColor: 'black',
    backgroundColor: '#ffffff',
    activeColor: '#03a9f4',
    deactiveColor: '#e2e2e2',
    textColor: '#383838',
    boxActiveBgColor: '#e1f5fe33',
    boxDeactiveBgColor: '#fff'
};

const boxActiveBgColor = '#e1f5fe33'

export { RadioButtonText };