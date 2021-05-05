import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const ExpandableTableCell = ({ children, style, numeric, textColor }) => {
    return (
        <View style={[styles.container, numeric && styles.right, style]} >
            { typeof children === 'string' ? 
                <Text style={{color: textColor}}>{ children }</Text>
                :
                ({ children })
            }
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