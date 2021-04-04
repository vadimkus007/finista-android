import deviceStorage from '../services/deviceStorage';

const authHeader = async () => {
    const token = await deviceStorage.loadJWT();
    if (token) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
};

export { authHeader };