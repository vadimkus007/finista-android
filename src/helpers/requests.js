import { SERVER_URL } from '../config/config.json';

import { authHeader } from '../services/authHeader';

const getRequest = async (endPoint) => {
    const API_URL = SERVER_URL + endPoint;

    const _header = await authHeader();

    const requestOptions = { method: 'GET', headers: _header };

    return fetch(API_URL, requestOptions)
    .then(response => response.json());
};

const postRequest = async (endPoint, body) => {
    const API_URL = SERVER_URL + endPoint;
    const _header = await authHeader();
    var requestOptions = { method: 'POST', headers: _header, body: JSON.stringify(body) };
    requestOptions.headers['Content-Type'] = 'application/json';
    requestOptions.headers['Accept'] = 'application/json';

    return fetch(API_URL, requestOptions)
    .then(response => response.json());
};

export { getRequest, postRequest };