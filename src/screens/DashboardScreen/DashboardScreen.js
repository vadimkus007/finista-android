import React, { useState, useEffect } from 'react';
import { 
    StyleSheet, 
    View, 
    Text,
    ScrollView
} from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { getRequest, postRequest } from '../../helpers';

import { Loading } from '../../components/common';

import { DashboardCard } from '../../components';

import { showMessage, hideMessage } from 'react-native-flash-message';

const DashboardScreen = (props) => {

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    const _loadData = () => {
        const endPoint = '/favorites';
        getRequest(endPoint)
        .then(results => {
            if (typeof results === 'array') {
                const sorted = results.favorites.sort((a, b) =>  a.lasttoprevprice - b.lasttoprefprice);
                setFavorites(sorted);
            }
        })
        .catch(err => {
            console.log(err);
            showMessage({message: 'ERROR', description: err.message, type: 'danger'});
        });
    };

    useEffect(() => {
        setLoading(true);
        _loadData();
        setLoading(false);
    },[]);

    const getColor = (favorite) => {
        if (favorite.lasttoprevprice > 0) {
            let degree = favorite.lasttoprevprice / favorites[0].lasttoprevprice;
            let r = 84 - degree * 84;
            let g = 180 - degree * 100;
            let b = 108 - degree * 60;
            return `rgb(${r},${g},${b})`;         
        } else {
            let degree = favorite.lasttoprevprice / favorites[favorites.length-1].lasttoprevprice;
            let r = 223 - degree * 87;
            let g = 119 - degree * 77;
            let b = 126 - degree * 84;
            return `rgb(${r},${g},${b})`;
        } 
    }

    return (
        
        <ScrollView contentContainerStyle={ styles.container } >
            { !loading ? 

                favorites.map(favorite => (
                    <View key={favorite.secid} style={ styles.item }>
                        <DashboardCard
                            data={ favorite }
                            color={ getColor(favorite) }
                        />
                    </View>
                ))
                
                : 
                <Loading size={ 'large' } />
            }

            <StatusBar style="auto" />
        </ScrollView>
        
        
    );

};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: '2%',
  },
  item: {
    width: '46%',
    minHeight: 60,
    margin: '2%'
  },
  scrollView: {
    backgroundColor: 'white',
  }
});

export { DashboardScreen };