import React from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, multiline, numberOfLines }) => {

  const {inputStyle, labelStyle, containerStyle } = styles;

  const validationColor='#223e4b';

  return (
    <View style={ containerStyle }>
      
        { label &&
            <Text style={ labelStyle }>{ label }</Text>
        }
      
        <TextInput
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            autoCorrect={false}
            multiline={multiline}
            numberOfLines={numberOfLines}
            style={inputStyle}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  labelStyle: {
    fontSize: 16,
    paddingLeft: 20,
    flex: 1
  },
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 3
  }
});

export { Input };