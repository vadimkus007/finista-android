import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const ExpandableTableCell = ({ children, style, numeric, text, textStyle, onPress }) => {
    return (
        <View style={[styles.container, numeric && styles.right, style]} >
            { text ? <Text style={textStyle}>{text}</Text> : children }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    right: {
        justifyContent: 'flex-end',
    },
});

ExpandableTableCell.displayName = 'ExpandableTable.Cell';

export { ExpandableTableCell };