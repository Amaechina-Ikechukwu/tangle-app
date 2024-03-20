import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Svg, { Defs, ClipPath, Circle, Polygon, Path } from 'react-native-svg';
const RightHeartCutoutImage = ({ source }) => {
    return (
        <View style={styles.container}>
            
          <View style={styles.mask}>
            {/* <View style={styles.tail} /> */}
            <View style={styles.bubbleBorder}>
                <Image 
                style={styles.bottomCurveImage}
                source={source}
                />
            </View>
          </View>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        width: 170,
        height: 190,
        overflow: 'hidden',
      },
      fullImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
      },
      mask: {
        width: '100%',
        height: '100%',
        
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
      },
      bottomCurveImage: {
        // You can choose any color you prefer
        width: 150,
        height: 180, // Adjusted height to make it more rectangular
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white', // or any color you want for the bubble
        borderTopRightRadius: 100, // rounded corners
        borderTopLeftRadius: 100,
        borderBottomRightRadius: 100,
        borderBottomLeftRadius: 0, // no rounded corner at the bottom left to accommodate the tail
        overflow: 'hidden',
        paddingLeft: 10, // Extra padding to ensure the content doesn't overlap with the tail
      },
      tail: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10, 
        borderRightWidth: 0,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white', // same as bubble background
        position: 'absolute',
        bottom: 0,
        left: 0,
      },
      bubbleBorder: {
        width: 160,
        height: 190,
        borderTopRightRadius: 100,
        borderTopLeftRadius: 100,
        borderBottomRightRadius: 100,
        borderBottomLeftRadius: 0,
        borderWidth: 5,
        borderColor: '#f62459',
        alignItems: 'center',
        justifyContent: 'center',
    },
    });
    
export default RightHeartCutoutImage;
