import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet } from "react-native";

import * as Location from "expo-location";
import { UpdateLocation } from "../../../services/Profile/api";
import { auth } from "../../../firebase";
import { useStore } from "../../../store/store";
import { useShallow } from "zustand/react/shallow";

export default function LocationHome() {
  const [location] = useStore(useShallow((state) => [state.location]));
  let text = JSON.stringify(location);
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
});
