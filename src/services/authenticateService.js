import { SERVER_URL } from '../config/config.json';

const authenticateService = {
    signin,
    signup
}

function signin(email, password) {
    const API_URL = SERVER_URL + '/signin';
        return fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
        .then(data => data.json());
}

function signup(user) {
    const API_URL = SERVER_URL + '/signup';
        return fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(result => result.json());
}

export default authenticateService;