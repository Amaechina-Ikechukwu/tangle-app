import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const ImageCutout = ({children}) => {
  return (
    <View style={styles.container}>
      {/* Your Image */}
      {/* <Image 
        source={{ uri: 'https://your-image-url-here' }}
        style={styles.imageStyle}
      /> */}
      {children}

      {/* SVG Overlay */}
      <Svg style={styles.svgStyle}>
        <Circle
          cx="50%"
          cy="50%"
          r="40%" // Radius of the circle
          fill="rgba(255, 255, 255, 0.7)" // Semi-transparent white to see the cutout effect
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
  svgStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default ImageCutout;
