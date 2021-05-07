import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { DataTable } from 'react-native-paper';

import { Loading } from '../../components/common';

import { getRequest } from '../../helpers';

import { PortfolioHeader } from '../../components';
import { ExpandableTable as Table } from '../../components';

const sortArray = (arr, key) => {
    return arr.sort((a, b) => {
        return b[key] - a[key];
    });
};

const ActivesScreen = (props) => {

    const [portfolio, setPortfolio] = useState({});
    const [loading, setLoading] = useState(false);
    const [shares, setShares] = useState([]);
    const [etf, setEtf] = useState([]);
    const [bonds, setBonds] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        let _portfolio = props.navigation.getParam('portfolio');
        if (_portfolio) {
            setPortfolio(_portfolio);
            setLoading(true);
            _loadData(_portfolio.id);
        } else {
            props.navigation.navigate('Portfolios');
        };
    }, []);

    const _loadData = (portfolioId) => {
        const endPoint = '/portfolio/' + portfolioId + '/actives';
        getRequest(endPoint)
        .then(results => {
            if (results.error) {
                console.log(results.error);
            }
            setPortfolio(results.data.portfolio);
            setShares(sortArray(results.data.shares, 'profit'));
            setEtf(sortArray(results.data.etf, 'profit'));
            setBonds(sortArray(results.data.bonds, 'profit'));
            setHistory(results.data.history);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
        });
    };

    const getColor = (value) => {
        if (value > 0) {
            return 'green';
        } else if (value < 0) {
            return 'red';
        }
    }

    const activesTable = (actives) => {
        return (
            <Table>
                {actives.map(item => (
                    <Table.Row key={ item.secid }>
                        <Table.Cell>
                            <Text style={{ color: getColor(item.changePrc) }}>
                                { item.SHORTNAME + ' (' + item.changePrc + ' %)' }
                            </Text>
                        </Table.Cell>
                        <Table.Cell numeric>
                            <Text>
                                { Number(item.last).toFixed(2) }
                            </Text>
                        </Table.Cell>
                        <Table.Cell numeric textColor={getColor(item.profit)}>
                            <Text  style={{ color: getColor(item.changePrc) }}>
                                { Number(item.profit).toFixed(2) }
                            </Text>
                        </Table.Cell>
                        <Table.Cell numeric>
                            <Text>
                                { Number(item.percentage).toFixed(2) }
                            </Text>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table>
        );
    }

    return (
        <ScrollView contentContainerStyle={ styles.container } >
            { !loading ?
                <>
                <PortfolioHeader portfolio={ portfolio } />

                <Table style={{ marginTop: 10 }} >
                    <Table.Header style={{ backgroundColor: '#f1f8ff' }}>
                        <Table.Title>
                            <Text style={ styles.title }>Актив</Text>
                        </Table.Title>
                        <Table.Title numeric>
                            <Text style={ styles.title }>Стоимость</Text>
                        </Table.Title>
                        <Table.Title numeric>
                            <Text style={ styles.title }>Прибыль</Text>
                        </Table.Title>
                        <Table.Title numeric>
                            <Text style={ styles.title }>Доля</Text>
                        </Table.Title>
                    </Table.Header>

                    { (portfolio.shares && portfolio.shares.cost > 0) && (
                    <Table.Row expandable data={ activesTable(shares) } style={{backgroundColor: '#f6f6f6'}}>
                        <Table.Cell><Text>Акции</Text></Table.Cell>
                        <Table.Cell numeric><Text>{ Number(portfolio.shares.cost).toFixed(2) }</Text></Table.Cell>
                        <Table.Cell numeric>
                            <Text style={{ color: getColor(portfolio.shares.profit) }}>
                                { Number(portfolio.shares.profit).toFixed(2) }
                            </Text>
                        </Table.Cell>
                        <Table.Cell numeric><Text>{ Number(portfolio.shares.percentage).toFixed(2) }</Text></Table.Cell>
                    </Table.Row>
                    )}
                    { (portfolio.etf && portfolio.etf.cost > 0) && (
                    <Table.Row expandable data={ activesTable(etf) } style={{backgroundColor: '#f6f6f6'}}>
                        <Table.Cell><Text>ETF/ПИФ</Text></Table.Cell>
                        <Table.Cell numeric><Text>{ Number(portfolio.etf.cost).toFixed(2) }</Text></Table.Cell>
                        <Table.Cell numeric>
                            <Text style={{ color: getColor(portfolio.etf.profit) }}>
                                { Number(portfolio.etf.profit).toFixed(2) }
                            </Text>
                        </Table.Cell>
                        <Table.Cell numeric><Text>{ Number(portfolio.etf.percentage).toFixed(2) }</Text></Table.Cell>
                    </Table.Row>
                    ) }
                    { (portfolio.bonds && portfolio.bonds.cost > 0) && (
                    <Table.Row expandable data={ activesTable(bands) } style={{backgroundColor: '#f6f6f6'}}>
                        <Table.Cell><Text>Облигации</Text></Table.Cell>
                        <Table.Cell numeric><Text>{ Number(portfolio.bonds.cost).toFixed(2) }</Text></Table.Cell>
                        <Table.Cell numeric>
                            <Text style={{ color: getColor(portfolio.bonds.profit) }}>
                                { Number(portfolio.bonds.profit).toFixed(2) }
                            </Text>
                        </Table.Cell>
                        <Table.Cell numeric><Text>{ Number(portfolio.bonds.percentage).toFixed(2) }</Text></Table.Cell>
                    </Table.Row>
                    ) }
                    <Table.Row style={{backgroundColor: '#f6f6f6'}}>
                        <Table.Cell><Text>Рубли</Text></Table.Cell>
                        <Table.Cell numeric><Text>{ Number(portfolio.cashe).toFixed(2) }</Text></Table.Cell>
                        <Table.Cell numeric><Text>-</Text></Table.Cell>
                        <Table.Cell numeric><Text>{ Number(portfolio.cashePercentage).toFixed(2) }</Text></Table.Cell>
                    </Table.Row>

                </Table>

                </>
                :
                <Loading size={'large'} />
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
    padding: 10,
  },
  table: {
    width: '100%',
  },
  title: {
    fontWeight: '700',
  }
});

export { ActivesScreen };