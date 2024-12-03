import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

const LoginScreen = ({ navigation, onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const gradientOpacity1 = useRef(new Animated.Value(1)).current;
  const gradientOpacity2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(gradientOpacity1, {
            toValue: 0,
            duration: 6000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(gradientOpacity2, {
            toValue: 1,
            duration: 6000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(gradientOpacity1, {
            toValue: 1,
            duration: 6000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(gradientOpacity2, {
            toValue: 0,
            duration: 6000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ]),
      ])
    ).start();
  }, [gradientOpacity1, gradientOpacity2]);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please enter your phone number and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/users/login', { phone, password });
      const { token, user } = response.data; // Extract token and user details from response

      if (!token) {
        throw new Error('Token not received from the server');
      }

      // Save token and user details to AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      Alert.alert('Success', 'Login successful!');
      onLoginSuccess(); // Notify AppNavigator of successful login
    } catch (error) {
      console.error('Login Error:', error.response?.data?.message || error.message);
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Unable to login. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View style={styles.container}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: gradientOpacity1,
          },
        ]}
      >
        <LinearGradient
          colors={['#243447', '#3C40C6', '#18DCFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: gradientOpacity2,
          },
        ]}
      >
        <LinearGradient
          colors={['#3AE374', '#10AC84', '#243447']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <LottieView
        source={require('../assets/NetSpeed.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Login to your account</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'LOGIN'}</Text>
      </TouchableOpacity>
      <Text style={styles.registerText}>
        New user?{' '}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          Register here
        </Text>
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lottie: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    alignSelf: 'center',
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#3C40C6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  registerLink: {
    color: '#3AE374',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
