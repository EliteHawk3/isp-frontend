import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'https://internetserviceprovider.vercel.app/api', // Backend URL hosted on Vercel
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add a request interceptor to include the token
API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve token from storage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Attach token as Bearer
        console.log('Token attached to request:', token); // Debugging: Log token
      } else {
        console.warn('No token found in AsyncStorage');
      }
      console.log(`API Request: [${config.method.toUpperCase()}] ${config.url}`); // Debugging: Log request info
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data); // Debugging: Log successful responses
    return response; // Simply return the response if successful
  },
  async (error) => {
    if (error.response) {
      console.error(
        `API Error: [${error.response.status}] ${error.response.config.url} - ${
          error.response.data?.message || 'Unknown Error'
        }`
      );

      // Handle 401 (Unauthorized) errors specifically
      if (error.response.status === 401) {
        console.warn('Unauthorized: Token might be invalid or expired.');
        // Optional: Redirect to login or clear invalid token
        await AsyncStorage.removeItem('token'); // Clear token to force login
        // Navigate to login screen (you'll need a navigation reference or callback for this)
      }

      // Handle 500 (Internal Server Error)
      if (error.response.status === 500) {
        console.error('Internal Server Error occurred on the backend.');
      }
    } else {
      console.error('Network error or server unreachable:', error.message);
    }
    return Promise.reject(error);
  }
);

export default API;
