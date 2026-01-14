import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    validateToken: () => api.post('/auth/validate'),
};

export const profileAPI = {
    getProfile: (userId) => api.get(userId ? `/profile/${userId}` : '/profile/me'),
    createProfile: (profileData) => api.post('/profile', profileData),
    updateProfile: (profileData) => api.put('/profile', profileData),
    deleteProfile: () => api.delete('/profile'),
};

export default api;
