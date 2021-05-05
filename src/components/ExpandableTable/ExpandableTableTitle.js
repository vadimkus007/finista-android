import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const ExpandableTableTitle = ({ children, style, numeric }) => {
    return (
        <View style={ [styles.title, numeric && styles.right, style] } >
            { children }
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontWeight: '700',
        alignItems: 'center',
    },
    right: {
        justifyContent: 'flex-end',
    }
});

ExpandableTableTitle.displayName = 'ExpandableTable.Title';

export { ExpandableTableTitle };