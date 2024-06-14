import React from "react";
import { View, Text as RNText, StyleSheet } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

const CircularProgressBar = ({ progress }) => {
  const size = 60; // Reduced size
  const strokeWidth = 6; // Adjusted stroke width
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = ((100 - progress) / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FF8A65" />
            <Stop offset="100%" stopColor="#FF3D00" />
          </LinearGradient>
        </Defs>
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#ECECEC"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
        />
        {/* Percentage Text */}
        <RNText style={styles.text}>{`${progress}%`} </RNText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 60,
    height: 60,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    position: "absolute",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    top: 22,
    left: "30%",
    // transform: [{ translateX: -6 }, { translateY: -6 }], // Adjust based on text size
  },
});

export default CircularProgressBar;
