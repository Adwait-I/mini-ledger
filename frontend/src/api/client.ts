import axios from 'axios';
import { Platform } from 'react-native';

// In development:
// - iOS Simulator / Web: http://localhost:5001/api
// - Android Emulator: http://10.0.2.2:5001/api
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5001/api';
  }
  return 'http://localhost:5001/api';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// Automatically inject Authorization Bearer token into outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    if (authToken && config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
