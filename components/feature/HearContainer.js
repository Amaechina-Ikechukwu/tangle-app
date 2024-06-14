import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const HeartContainer = ({ children }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/heart.png')}
        style={styles.heartMask}
      />
       <Image style={styles.personPhoto} source={require('../assets/images/onboarding/face_3.jpg')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  heartMask: {
    width: 200, // Adjust the dimensions based on your heart shape
    height: 200,
  },
  personPhoto: {
    width: 150, // Adjust the dimensions of the photo
    height: 150,
    position: 'absolute',
  },
});

export default HeartContainer;
backgroundColor: '#FF355E',  // Updated to Radical Red
borderRadius: 8,
paddingHorizontal: 10,
paddingVertical: 5,