import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = (credentials) => api.post('/auth/login', credentials);
export const getEmployees = () => api.get('/employee');

export default api;
