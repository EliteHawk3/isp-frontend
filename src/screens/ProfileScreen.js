import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import API from '../services/api';
import { TouchableOpacity } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/users/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message);
        Alert.alert('Error', 'Unable to load profile information.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <LinearGradient
        colors={['#3AE374', '#009EFD', '#3C40C6']}
        style={styles.container}
      >
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  if (!profile) {
    return (
      <LinearGradient
        colors={['#3AE374', '#009EFD', '#3C40C6']}
        style={styles.container}
      >
        <Text style={styles.errorText}>Unable to fetch profile information.</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#3AE374', '#009EFD', '#3C40C6']} style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Name: {profile.name || 'N/A'}</Text>
        <Text style={styles.cardText}>Phone: {profile.phone || 'N/A'}</Text>
        <Text style={styles.cardText}>Address: {profile.address || 'N/A'}</Text>
        <Text style={styles.cardText}>Package: {profile.packageName || 'N/A'}</Text>
        <Text style={styles.cardText}>
          Payment Status: {profile.paymentStatus || 'N/A'}
        </Text>
        <Text style={styles.cardText}>
          Next Payment Due:{' '}
          {profile.dueDate ? new Date(profile.dueDate).toDateString() : 'N/A'}
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#009EFD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
