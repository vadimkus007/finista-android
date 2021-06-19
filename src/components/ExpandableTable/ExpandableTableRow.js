import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Entypo as Icon } from '@expo/vector-icons';

const ExpandableTableRow = ({ children, style, onPress, expandable, data }) => {

    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <>
        <TouchableOpacity style={ {...styles.row, ...style} } onPress={ expandable ? toggleExpanded : onPress } >
            { expandable && (
                <View style={ {position: 'absolute', } }>
                <Icon name={ expanded ? ('triangle-down') : ('triangle-right') } color='gray' size={14} />
                </View>
            )}
            { children }
        </TouchableOpacity>
        { expanded && (
            <View>
                {data}
            </View>
        )}
        </>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 36,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});

ExpandableTableRow.displayName = 'ExpandableTable.Row';

export { ExpandableTableRow };