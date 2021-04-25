import React from 'react';
import { TextInput as RNTextInput, View, Text, StyleSheet } from 'react-native';
import { Entypo as Icon } from '@expo/vector-icons';

const TextInput = ({ label, icon, ...otherProps }) => {

    const { containerStyle, labelStyle, inputStyle, iconStyle } = styles;

    const validationColor = '#223e4b';

    return (
        <View style={ containerStyle }>
            <Text style={ labelStyle }>{ label }</Text>
            <View style={ inputStyle }>
                { icon && 
                    <View style={{ padding: 8 }}>
                        <Icon name={ icon } color={ validationColor } size={16}/>
                    </View>
                }
                <View style={{ flex: 1 }}>
                    <RNTextInput 
                        underlineColorAndroid='transparent'
                        placeholderTextColor='rgba(34, 62, 75, 0.7)'
                        label={ label }
                        {...otherProps}
                        style={{ fontSize: 18 }}
                    />
                </View>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'column',
        minHeight: 70,
        flex: 1,
    },
    inputStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: StyleSheet.hairlineWidth,
        lineHeight: 23,
        minHeight: 30,
        padding: 8,
    },
    iconStyle: {
        padding: 8
    },
    labelStyle: {
        fontSize: 16,
        marginBottom: 4
    }
});

export { TextInput };