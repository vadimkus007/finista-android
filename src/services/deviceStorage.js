import { AsyncStorage } from 'react-native';

const deviceStorage = {

    async saveItem(key, value) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    },

    async loadJWT() {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                return value;
            } else {
                return '';
            }

        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    },

    async deleteJWT(key = 'token') {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    }

};

export default deviceStorage;