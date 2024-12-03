import React, { useEffect } from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const navigateToAppropriateScreen = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('SplashScreen Token:', token);

        if (token) {
          navigation.replace('Dashboard'); // Navigate to Dashboard if token exists
        } else {
          navigation.replace('Login'); // Navigate to Login if no token
        }
      } catch (error) {
        console.error('Error checking token in SplashScreen:', error.message);
        navigation.replace('Login'); // Fallback to Login on error
      }
    };

    const timer = setTimeout(() => {
      navigateToAppropriateScreen();
    }, 3000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#243447', '#009EFD', '#2AF598']}
      style={styles.container}
    >
      <LottieView
        source={require('../assets/Loader1.json')} // Confirm this path is correct
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.title}>Welcome to AlHadi ISP</Text>
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: width * 0.6, // Responsive size
    height: height * 0.3,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default SplashScreen;
