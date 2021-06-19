import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import {
    LineChart,
    Grid,
    YAxis,
    XAxis
} from 'react-native-svg-charts';

import * as scale from 'd3-scale';
import moment from 'moment';

const StockChart = ({ data, style, yAccessor, xAccessor, formatYLabel }) => {
    return (
        <View style={{ width: '100%', padding: 10}}>
            <View style={{ flexDirection: 'row' }}>
                <YAxis
                    data={ data }
                    svg={{
                        fill: 'grey',
                        fontSize: 10,
                    }}
                    contentInset={{ top: 20, bottom: 20 }}
                    yAccessor={ yAccessor }
                />
                <LineChart 
                    style={ [style, { flex: 1, marginLeft: 10 }] }
                    data={ data }
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                    contentInset={{ top: 20, bottom: 20 }}
                    yAccessor={ yAccessor }
                    xAccessor={ xAccessor }
                    xScale={ scale.scaleTime }
                    numberOfTicks={5}
                >
                    <Grid />
                </LineChart>
            </View>
            <View style={{ marginLeft: 0 }}>
                <XAxis 
                    style={{ height: 30, paddingTop: 0 }}
                    data={data}
                    xAccessor={ xAccessor }
                    contentInset={{ left: 20 }}
                    svg={{ fontSize: 10, fill: 'grey', rotation: 30, translateY: 10 }}
                    scale={ scale.scaleTime }
                    spacingInner={ 0.05 }
                    formatLabel={(value, index) => {
                        if (index%10) return moment(value).format('MMM YY'); else return "";
                    }}
                    numberOfTicks={7}
                />
            </View>
        </View>
    );
};

export { StockChart };