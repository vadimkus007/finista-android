import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { ExpandableTableHeader } from './ExpandableTableHeader';
import { ExpandableTableTitle } from './ExpandableTableTitle';
import { ExpandableTableCell } from './ExpandableTableCell';
import { ExpandableTableRow } from './ExpandableTableRow';


const ExpandableTable = ({ children, style, columns, data }) => {

    return (
        <View style={{...styles.container, ...style}}>
            { children }
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});

ExpandableTable.Header = ExpandableTableHeader;

ExpandableTable.Title = ExpandableTableTitle;

ExpandableTable.Cell = ExpandableTableCell;

ExpandableTable.Row = ExpandableTableRow;

export { ExpandableTableHeader };

export { ExpandableTableTitle };

export { ExpandableTableCell };

export { ExpandableTableRow };

export { ExpandableTable };