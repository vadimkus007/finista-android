import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { showMessage } from 'react-native-flash-message';

import { FontAwesome as Icon } from '@expo/vector-icons';

import { Loading } from '../../components/common';
import deviceStorage from '../../services/deviceStorage';
import { getRequest } from '../../helpers';

const QuoteScreen = (props) => {

    const [secid, setSecid] = useState('');
    const [loading, setLoading] = useState(false);
    const [security, setSecurity] = useState({});
    const [history, setHistory] = useState([]);
    const [dividends, setDividends] = useState([]);
    const [favorite, setFavorite] = useState(false);

    useEffect(() => {
        const _secid = props.navigation.getParam('secid');
        setSecid(_secid);
        setLoading(true);
        _loadData(_secid);
    }, []);

    const _loadData = (secid) => {
        const endPoint = '/quotes/' + secid;
        getRequest(endPoint)
        .then(data => {
            setSecurity(data.securities);
            setHistory(data.history);
            setDividends(data.dividends);
            setFavorite(data.favorite);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            showMessage({ message: 'ERROR', description: err.message, type: 'danger' });
        });
    };

    const getDelta = (value, change) => {
        const prev = value / (1 + change/100);
        return (value - prev).toFixed(2);
    };

    const getColor = (value) => {
        if (value > 0) {
            return 'green';
        }
        if (value < 0) {
            return 'red';
        }
        return '#555';
    };

    return (
        <ScrollView contentContainerStyle={ styles.container } >
            { !loading ?
                <>
                <View style={ styles.header }>
                    <Text style={ styles.headerText }>{ security.SHORTNAME || security.NAME }</Text>
                    <TouchableOpacity onPress={() => {}}>
                        { favorite ?
                            <Icon name='star' size={24} color='#555' />
                            :
                            <Icon name='star-o' size={24} color='#555' />
                        }
                    </TouchableOpacity>
                </View>
                <View style={ styles.info }>
                    <View style={ { marginRight: 8 } }>
                    <Text style={ styles.last }>
                        { security.LAST || security.CURRENTVALUE }{' '}
                        { security.CURRENCYID === 'SUR' ? 
                            <Icon name='ruble' size={34} color='#555' style={ { marginLeft: 8 } } />
                        : security.CURRENCYID === 'USD' ? 
                        '$'
                        : null
                        }
                    </Text>
                    </View>
                    <View style={{ flexDirection: 'column', }}>
                        <Text style={{ color: getColor(security.LASTTOPREVPRICE || security.LASTCHANGEPRCNT || security.LASTCHANGETOOPENPRC), fontWeight: '700' }}>
                            { getDelta(security.LAST || security.CURRENTVALUE, security.LASTTOPREVPRICE || security.LASTCHANGEPRCNT || security.LASTCHANGETOOPENPRC) }
                            {' ('}
                            { security.LASTTOPREVPRICE || security.LASTCHANGEPRCNT || security.LASTCHANGETOOPENPRC }
                            { security.LASTTOPREVPRICE || security.LASTCHANGEPRCNT || security.LASTCHANGETOOPENPRC ? ' %)' : null}
                        </Text>
                        <Text>{ security.TIME ? security.TIME : null }</Text>
                    </View>
                </View>
                </>
            :
            <Loading size='large' />
            }
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
    header: {
        width: '100%',
        minHeight: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        paddingHorizontal: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#555'
    },
    info: {
        width: '100%',
        minHeight: 40,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    last: {
        fontSize: 38,
        fontWeight: '700',
        color: '#555'
    }
});

export { QuoteScreen };