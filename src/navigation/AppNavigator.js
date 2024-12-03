import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SplashScreen from '../screens/SplashScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token retrieved:', token);

        if (!token) {
          throw new Error('No token found');
        }

        // Validate the token with the backend
        const response = await API.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Token is valid. User:', response.data);
        setIsLoggedIn(true); // Set user as logged in
      } catch (error) {
        console.error('Token validation failed:', error.message);

        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('token'); // Clear invalid token
        }

        setIsLoggedIn(false); // Redirect to login
      } finally {
        setLoading(false); // Stop splash screen
      }
    };

    validateToken();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Clear token on logout
      console.log('Token removed: User logged out');
      setIsLoggedIn(false); // Update state
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  if (loading) {
    return <SplashScreen />; // Display splash screen while loading
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Dashboard">
              {(props) => <DashboardScreen {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  {...props}
                  onLoginSuccess={() => setIsLoggedIn(true)}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
