import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, //  YE LINE TERI COOKIES KO BACKEND TAK BHEJEGI
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Ye check karega ki agar token js-cookie mein hai, toh Header mein bhi daal do (Dual Safety)
api.interceptors.request.use((config) => {
  const token = Cookies.get('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;