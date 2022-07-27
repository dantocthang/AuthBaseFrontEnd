import axios from 'axios';
axios.defaults.withCredentials = true; 
const token = JSON.parse(localStorage.getItem('accessToken'))
const httpRequest = axios.create({
    baseURL: 'http://localhost:5000',
    headers: { Authorization: `Bearer ${token}` }
});

export const get = async (path, options = {}) => {
    const response = await httpRequest.get(path, options);
    return response.data;
};

export default httpRequest;