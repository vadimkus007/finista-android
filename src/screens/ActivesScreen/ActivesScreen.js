import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { DataTable } from 'react-native-paper';

import { Loading } from '../../components/common';

import { getRequest } from '../../helpers';

import { PortfolioHeader } from '../../components'

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
            setShares(results.data.shares);
            setEtf(results.data.etf);
            setBonds(results.data.bonds);
            setHistory(results.data.history);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
        });
    };

    return (
        <ScrollView contentContainerStyle={ styles.container } >
            { !loading ?
                <>
                <PortfolioHeader portfolio={ portfolio } />
                
                <DataTable>
                    <DataTable.Header style={{backgroundColor: '#f1f8ff'}}>
                        <DataTable.Title>Актив</DataTable.Title>
                        <DataTable.Title numeric>Стоимость</DataTable.Title>
                        <DataTable.Title numeric>Прибыль</DataTable.Title>
                        <DataTable.Title numeric>Доля</DataTable.Title>
                    </DataTable.Header>
                    { (portfolio.shares && portfolio.shares.cost > 0) && (
                        <DataTable.Row>
                            <DataTable.Cell>Акции</DataTable.Cell>
                            <DataTable.Cell numeric>{ Number(portfolio.shares.cost).toFixed(2) }</DataTable.Cell>
                            <DataTable.Cell numeric>{ Number(portfolio.shares.profit).toFixed(2) }</DataTable.Cell>
                            <DataTable.Cell numeric>{ Number(portfolio.shares.percentage).toFixed(2) }</DataTable.Cell>
                        </DataTable.Row>
                    )}
                    { (portfolio.etf && portfolio.etf.cost > 0) && (
                        <DataTable.Row>
                            <DataTable.Cell>ETF/ПИФ</DataTable.Cell>
                            <DataTable.Cell numeric>{ Number(portfolio.etf.cost).toFixed(2) }</DataTable.Cell>
                            <DataTable.Cell numeric>{ Number(portfolio.etf.profit).toFixed(2) }</DataTable.Cell>
                            <DataTable.Cell numeric>{ Number(portfolio.etf.percentage).toFixed(2) }</DataTable.Cell>
                        </DataTable.Row>
                    )}
                    { (portfolio.bonds && portfolio.bonds.cost > 0) && (
                        <DataTable.Row>
                            <DataTable.Cell>Облигации</DataTable.Cell>
                            <DataTable.Cell numeric>{ Number(portfolio.bonds.cost).toFixed(2) }</DataTable.Cell>
                            <DataTable.Cell numeric>{ Number(portfolio.bonds.profit).toFixed(2) }</DataTable.Cell>
                            <DataTable.Cell numeric>{ Number(portfolio.bonds.percentage).toFixed(2) }</DataTable.Cell>
                        </DataTable.Row>
                    )}
                    <DataTable.Row>
                        <DataTable.Cell>Рубли</DataTable.Cell>
                        <DataTable.Cell numeric>{ Number(portfolio.cashe).toFixed(2) }</DataTable.Cell>
                        <DataTable.Cell numeric>-</DataTable.Cell>
                        <DataTable.Cell numeric>{ Number(portfolio.cashePercentage).toFixed(2) }</DataTable.Cell>
                    </DataTable.Row>
                </DataTable>

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
});

export { ActivesScreen };