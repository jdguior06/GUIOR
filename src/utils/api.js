import axios from 'axios';
import { clearAuth } from '../reducers/authSlice';

const api = axios.create({
  baseURL: 'https://artistic-balance-production.up.railway.app/guior',
});

export const setAuthInterceptor = (store) => {
  api.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        store.dispatch(clearAuth());
        window.location.href = '/login'; // Redirige después de limpiar auth
      }
      return Promise.reject(error);
    }
  );
};

export default api;
