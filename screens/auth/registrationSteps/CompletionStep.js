import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const CompletionStep = ({ onRestart }) => {
  return (
    <View style={styles.container}>
      <FontAwesome name="check-circle" size={100} color="#00FF00" />
      <Text style={styles.title}>Registration Complete!</Text>
       
      <Text style={styles.message}>You have successfully completed the registration process.</Text>
      <Text style={styles.message}>A verification email has been sent to your email address.</Text>
      <Text style={styles.message}>Please check your inbox to verify your account.</Text>
      <Text style={styles.message}>Thank you for joining us!</Text>
      <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  restartButton: {
    backgroundColor: '#FF355E',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CompletionStep;
