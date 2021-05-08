import React, {useState, useEffect} from 'react';
import { 
    StyleSheet, 
    View, 
    Text,
    ScrollView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Loading } from '../../components/common';
import { AddPortfolioCard, PortfolioCard } from '../../components';

import { getRequest, postRequest } from '../../helpers';

import deviceStorage from '../../services/deviceStorage';

const PortfoliosScreen = (props) => {

    const [loading, setLoading] = useState(false);
    const [portfolios, setPortfolios] = useState([]);

    const handleAddPortfolio = () => {
        props.navigation.navigate('PortfolioEdit', {refresh: refreshData});
    };

    const selectPortfolio = async (portfolio) => {
        if (portfolio) {
            await deviceStorage.saveItem('portfolio', portfolio);
            props.navigation.navigate('PortfolioStack', {portfolio: portfolio});
        };
    };

    const editPortfolio = async (portfolio) => {
        if (portfolio) {
            await deviceStorage.saveItem('portfolio', portfolio);
        }
        props.navigation.navigate('PortfolioEdit', {portfolio: portfolio, refresh: refreshData});
    };

    const _loadData = () => {
        const endPoint = '/portfolios';
        getRequest(endPoint)
        .then(results => {
            setPortfolios(results.portfolios);
        })
        .catch(err => {
            console.log(err);
        });
    };

    const clearPortfolio = async () => {
        await deviceStorage.deleteItem('portfolio');
    };

    const refreshData = () => {
        _loadData();
    };

    useEffect(() => {
        setLoading(true);
        _loadData();
        clearPortfolio();
        setLoading(false);
    }, []);

    return (

        <ScrollView  contentContainerStyle={ styles.container } >
            {!loading ?
                <View >
                    {portfolios.map(portfolio => (
                        <PortfolioCard 
                            portfolio={portfolio}
                            onPress={() => {selectPortfolio(portfolio)}}
                            onEditPress={() => {editPortfolio(portfolio)}}
                            key={portfolio.id}
                        />
                    ))}
                    <AddPortfolioCard onPress={handleAddPortfolio} />
                </View>
                :
                <Loading size={ 'large' } />
            }
            <StatusBar style="auto" />
        </ScrollView>
    );

};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 10
  },
});

export { PortfoliosScreen };