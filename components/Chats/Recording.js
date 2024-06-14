import { useEffect, useState } from "react";
import { View, StyleSheet, Button, TouchableOpacity, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
export default function Recording({
  recording,
  stopRecording,
  startRecording,
  isRecording,
  duration,
  pauseRecording,
  hidden,
  setHidden,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.itemsContainer}>
        <TouchableOpacity
          onPress={() => stopRecording()}
          style={styles.insideInputIcon}
        >
          <FontAwesome name={"close"} size={20} color="red" />
        </TouchableOpacity>
        <Text>{isRecording ? "Recording..." : "Recording paused"}</Text>
      </View>
      <View style={styles.itemsContainer}>
        <Text>{duration}</Text>
        <TouchableOpacity
          onPress={() => setHidden()}
          style={styles.insideInputIcon}
        >
          <FontAwesome
            name={"eye-slash"}
            size={20}
            color={hidden ? "red" : "#888"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#ecf0f1",
    padding: 10,
    flexDirection: "row",
    borderRadius: 20,
  },
  itemsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
