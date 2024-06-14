import React, { useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const RandomCircleImages = ({ centerImage, surroundingImages }) => {
    const floatAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      }, []);

      const translateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 10], // adjust these values to control the distance of the floating effect
      });


  return (
    <View style={styles.container}>

        
      <Icon name="chatbubbles"  size={24} color="#FF355E"  style={[ { top: 0, left: 80}]}/>
      <Animated.Image source={require('../assets/images/onboarding/face_8.jpg')}  style={[
        styles.centerImage,
        { transform: [{ translateY }] },
      ]}/>
   
      <Image source={require('../assets/images/onboarding/face_1.jpg')} style={[styles.surroundingImage, { top: 100, left: 60}]} />
     
      <Image source={require('../assets/images/onboarding/face_3.jpg')} style={[styles.surroundingImage, { top: 10, left: 100}]} />
      
      <Icon name="location" size={24} color="#FF355E" style={{top: 10, right: 100}} />
      <Image source={require('../assets/images/onboarding/face_5.jpeg')} style={[styles.surroundingImage, { top: 100, right: 60}]} />
      <Image source={require('../assets/images/onboarding/face_2.jpg')} style={[styles.surroundingImage, { bottom: 0, right: 100}]} />
      <Image source={require('../assets/images/onboarding/face_6.jpeg')} style={[styles.surroundingImage, { bottom: 0, left: 100}]} />
      {/* <Image source={require('../assets/images/onboarding/face_1.jpg')} style={[styles.surroundingImage, { top: 10, left: 60}]} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    zIndex: 2,
  },
  surroundingImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    zIndex: 1,
  },
});

export default RandomCircleImages;
