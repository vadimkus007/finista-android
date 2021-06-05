import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

import { Loading } from '../../components/common';

import { getRequest } from '../../helpers';

import { RadioButtonText } from '../../components';

import { showMessage } from 'react-native-flash-message';

const Ruble = () => {
    return (
        <FontAwesome name='ruble' size={14} color='#555' />
    );
};

const getColor = (value) => {
    if (value > 0) {
        return 'green';
    }
    if (value < 0) {
        return 'red';
    }
    return '#555';
}

const QuotesScreen = (props) => {

    const tabs = [
        {
            value: 0,
            label: 'Акции'
        },
        {
            value: 1,
            label: 'ETF'
        },
        {
            value: 2,
            label: 'Индексы'
        },
        {
            value: 3,
            label: 'Облигации'
        },
    ];

    const [tabSelected, setTabSelected] = useState(0);
    const [table, setTable] = useState('shares');

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    const _loadData = () => {
        const endPoint = '/quotes';
        getRequest(endPoint)
        .then(data => {
            setData(data.data);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            showMessage({ message: 'ERROR', description: err.message, type: 'danger' });
        });
    };

    useEffect(() => {
        switch(tabSelected) {
            case 0:
                setTable('shares');
                break;
            case 1:
                setTable('etf');
                break;
            case 2:
                setTable('index');
                break;
            case 3: 
                setTable('bonds');
                break;
            default: 
                setTable('shares');
                break;
        }
    }, [tabSelected]);

    useEffect(() => {
        setLoading(true);
        _loadData();
    }, []);


    return (
        <ScrollView contentContainerStyle={ styles.container } >
            <>
            <View style={ styles.toolbar }>
                <RadioButtonText 
                    items={ tabs }
                    onSelected={ (value) => { setTabSelected(value) } }
                />
            </View>

            { !loading ? 
            <View style={ styles.body } >

                {
                    data[table] ?
                        data[table].map((item) => (
                            <View style={ styles.row } key={ item.SECID }>
                                <View style={ {...styles.cell, flex: 3} }>
                                    <View style={ { flexDirection: 'row', alignItems: 'baseline' } }>
                                        <Text style={ [styles.secid, { paddingRight: 8 }] }>{ item.SECID }</Text>
                                        <Text style={ styles.shortname } ellipsizeMode='clip'>{ item.SHORTNAME ? item.SHORTNAME : item.NAME }</Text>
                                    </View>
                                    <View>
                                        <Text style={ styles.date }>{ item.TIME }</Text>
                                    </View>
                                </View>
                                <View style={ [styles.cell, styles.right, {flex: 1}] }>
                                    <View style={ {flexDirection: 'row', alignItems: 'center'} }>
                                        <Text style={ {...styles.price, paddingRight: 4} }>{ item.LAST ? item.LAST : item.CURRENTVALUE }</Text>
                                        { item.LAST || item.CURRENTVALUE ? <Ruble /> : null}
                                    </View>
                                    <View>
                                        <Text style={ {...styles.change, color: getColor(item.LASTTOPREVPRICE || item.LASTCHANGEPRCNT || item.LASTCHANGETOOPENPRC)} }>
                                            { item.LASTTOPREVPRICE || item.LASTCHANGEPRCNT || item.LASTCHANGETOOPENPRC }
                                            { item.LASTTOPREVPRICE || item.LASTCHANGEPRCNT || item.LASTCHANGETOOPENPRC ? ' %' : null }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    : 
                    <Text>Data not loaded</Text>
                }

            </View>
            : 
            <Loading size='large' />
            }
            </>
        
            <StatusBar style="auto" />
        </ScrollView>
    );

};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  toolbar: {
    width: '100%',
    marginTop: 8,
    marginBottom: 8,
    padding: 10,
    paddingBottom: 0,
  },
  body: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
    cell: {
        flex: 1,
        flexDirection: 'column',
        padding: 2,
    },
    right: {
        alignItems: 'flex-end',
    },
    secid: {
        color: '#555',
        fontSize: 16,
        fontWeight: '700',
    },
    shortname: {
        color: '#555',
        fontSize: 14,
    },
    date: {
        color: '#555',
        fontSize: 14
    },
    price: {
        color: '#555',
        fontSize: 16,
        fontWeight: '700',
    },
    change: {
        fontSize: 14,

    }
});

export { QuotesScreen };