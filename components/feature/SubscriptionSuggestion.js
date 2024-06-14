import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Colors from "../../Colors";
import { navigate } from "../../navigations/navigationRef";

const SubscriptionSuggestion = ({ text }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f87171", Colors.light.acccent]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <TouchableOpacity
          onPress={() => navigate({ name: "Payments" })}
          style={{ width: "100%" }}
        >
          <Text style={{ color: Colors.dark.text, textAlign: "center" }}>
            Tap to {text}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    width: "100%",
    padding: 20,
    borderRadius: 20,
    margin: 10,
    opacity: 0.8,
  },
});

export default SubscriptionSuggestion;
