import React, { useState, useEffect } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { showMessage } from 'react-native-flash-message';

import { FontAwesome as Icon } from '@expo/vector-icons';

import { Loading } from '../../components/common';
import deviceStorage from '../../services/deviceStorage';
import { getRequest, postRequest } from '../../helpers';

// import { LineChart, CandleStick } from 'react-native-charts-wrapper';

import { StockChart } from '../../components/StockChart';


const {width, height} = Dimensions.get('window');

const QuoteScreen = (props) => {

    const [secid, setSecid] = useState('');
    const [loading, setLoading] = useState(false);
    const [security, setSecurity] = useState({});
    const [history, setHistory] = useState([{}]);
    const [candles, setCandles] = useState([{}]);
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
            setCandles(data.candles);
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

    function handleFavorite() {
        const endPoint = '/quotes/'+secid;
        postRequest(endPoint)
        .then(result => {
            setFavorite(result.favorite);
        })
        .catch(err => {
            console.log(err);
        })

    }

    const data = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]

    return (
        <ScrollView contentContainerStyle={ styles.container } >
            { !loading ?
                <>
                <View style={ styles.header }>
                    <Text style={ styles.headerText }>{ security.SHORTNAME || security.NAME }</Text>
                    <TouchableOpacity onPress={() => { handleFavorite() }}>
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

                <StockChart 
                    data={ history }
                    style={ {height: 200} }
                    yAccessor={({item}) => item[1]}
                    xAccessor={ ({item}) => item[0] }
                    formatYLabel={ ({value}) => value[1] }
                />

                { dividends && dividends.length > 0 
                    ?
                <View style={ styles.tableContainer }>
                    <View style={ styles.header }>
                        <Text style={ styles.headerText }>Дивиденды</Text>
                    </View>
                    <View style={ styles.row }>
                        <View style={ styles.cell }>
                            <Text style={ { fontWeight: '700' } }>Дата</Text>
                        </View>
                        <View style={ styles.cell }>
                            <Text style={ { fontWeight: '700' } }>Дивиденд на акцию</Text>
                        </View>
                    </View>
                    { dividends.map((row) => (
                        <View style={ styles.row } key={row.registryclosedate}>
                            <View style={ styles.cell }>
                                <Text>{ row.registryclosedate }</Text>
                            </View>
                            <View style={ styles.cell }>
                                <Text>{ row.value }</Text>
                            </View>
                        </View>
                    )) }
                </View>
                : 
                null
                }
                
                
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
    },
    stockChartContainer: {
        alignItems: 'center',
    },
    chart: {

    },
    tableContainer: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingVertical: 4,
    },
    cell: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 2,
    },
    right: {
        justifyContent: 'flex-end',
    },
});

export { QuoteScreen };