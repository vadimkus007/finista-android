import AsyncStorage from '@react-native-async-storage/async-storage';

const deviceStorage = {

    async saveItem(key, value) {
        try {
            let val = value;
            if (typeof(val) === 'object') {
                val = JSON.stringify(val);
            }
            await AsyncStorage.setItem(key, val);
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
    },

    async loadItem(key) {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                return JSON.parse(value);
            } else {
                return '';
            }
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    }

};

export default deviceStorage;