import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

const Loading = ({ size }) => {
    return (
        <View style={ styles.spinnerContainer } >
            <ActivityIndicator size={ size } color="#0000ff" />
        </View>
    );
};

const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        marginTop: 12,
        marginBottom: 12
    }
});

export { Loading };