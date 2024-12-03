import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import API from '../services/api';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const handleRegister = async () => {
    // Clear previous errors
    setPhoneError('');

    if (!name || !phone || !password || !address) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password.length !== 6) {
      Alert.alert('Error', 'Password must be exactly 6 characters long.');
      return;
    }

    // Phone number validation: must be between 10 to 15 digits
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Phone number must be between 10 to 15 digits.');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/users/register', {
        name,
        phone,
        password,
        address,
      });

      console.log('Registration response:', response.data);

      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        Alert.alert('Success', 'Registration successful!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      } else {
        Alert.alert('Success', 'Registration successful! Please log in.');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1B1F3A', '#009EFD', '#2AF598']} style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Password (6 characters)"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        placeholderTextColor="#aaa"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? <ActivityIndicator color="#fff" /> : 'REGISTER'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          Login
        </Text>
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  input: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 15,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#009EFD',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
  },
  loginLink: {
    color: '#2AF598',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    marginBottom: 8,
  },
});

export default RegisterScreen;
