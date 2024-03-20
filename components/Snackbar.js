import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

const Snackbar = ({ visible, message, duration = 3000, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
    if (visible) {
      setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) {
          onDismiss();
        }
      }, duration);
    }
  }, [visible, duration, onDismiss]);

  return (
    <Modal transparent={true} animationType="slide" visible={isVisible}>
      <View style={styles.container}>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.button}>
          <Text style={styles.buttonText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'transparent',
    padding: 8,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default Snackbar;
