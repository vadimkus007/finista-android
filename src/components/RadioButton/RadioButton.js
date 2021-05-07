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

const RadioButton = ({ items, onSelected }) => {

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
                    var buttonStyle = (key === 0) 
                        ? {...styles.button, ...styles.buttonFirst} 
                        : (key === radioItems.length-1) ? 
                            {...styles.button, ...styles.buttonLast} 
                            : styles.button;
                    buttonStyle = (key === selected) ? {...buttonStyle, ...styles.buttonSelected} : buttonStyle;
                    return (
                        <TouchableOpacity key={key} style={ buttonStyle } onPress={ () => {handleSelect(key)} }>
                            { item.label }
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
        backgroundColor: '#03a9f4',
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

export { RadioButton };