import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

const LeftHeartCutoutImage = ({ source }) => {
    const floatAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false, // Set this to false
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false, // Set this to false
                }),
            ]),
        ).start();
    }, []);
    

    const translateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-5, 5], 
    });
    
    return (
        <View style={styles.container}>
          <View style={styles.bubbleBorder} >
            <Animated.Image 
                source={source}
                style={[
                    styles.bottomCurveImage,
                     { transform: [{ translateY: translateY }] },
                  ]}
            />
          </View>
        </View>
    );
};
    
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 170,
        height: 190,
    },
    bottomCurveImage: {
        width: 150,
        height: 180,
        backgroundColor: 'white',
        borderTopRightRadius: 100,
        borderTopLeftRadius: 100,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 100,
    },
    bubbleBorder: {
        width: 160,
        height: 190,
        borderTopRightRadius: 100,
        borderTopLeftRadius: 100,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 100,
        borderWidth: 5,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});

export default LeftHeartCutoutImage;
