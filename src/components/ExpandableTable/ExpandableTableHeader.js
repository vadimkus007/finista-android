import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const ExpandableTableHeader = ({ children, style }) => {
    return (
        <View style={ {...styles.header, ...style} } >
            { children }
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 36,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth * 2,
    },
});

ExpandableTableHeader.displayName = 'ExpandableTable.Header';

export { ExpandableTableHeader };