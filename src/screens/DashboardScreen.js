import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import API from '../services/api';

const DashboardScreen = ({ navigation, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.warn('No token found in AsyncStorage');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }

        const response = await API.get('/users/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data.profile);
        setNotifications(response.data.notifications);
      } catch (error) {
        if (error.response?.status === 401) {
          // Handle expired or invalid token
          await AsyncStorage.removeItem('token');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          Alert.alert('Session Expired', 'Please log in again.');
        } else {
          console.error('Error fetching dashboard data:', error.message);
          Alert.alert('Error', 'Unable to fetch dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigation]);

  const handleViewProfile = () => {
    try {
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Unable to navigate to Profile.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009EFD" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#1B1F3A', '#009EFD', '#2AF598']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Dashboard</Text>
        {userData ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome, {userData.name}!</Text>
            <Text style={styles.cardText}>Package: {userData.packageName || 'N/A'}</Text>
            <Text style={styles.cardText}>Payment Status: {userData.paymentStatus || 'N/A'}</Text>
            <Text style={styles.cardText}>
              Next Payment Due: {userData.dueDate ? new Date(userData.dueDate).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        ) : (
          <Text style={styles.cardText}>Unable to load user data.</Text>
        )}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Notifications</Text>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <Text key={index} style={styles.cardText}>
                - {notification.message}
              </Text>
            ))
          ) : (
            <Text style={styles.cardText}>No notifications available.</Text>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleViewProfile}>
          <Text style={styles.buttonText}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={onLogout} // Call the centralized onLogout function
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#009EFD',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3E4D',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
