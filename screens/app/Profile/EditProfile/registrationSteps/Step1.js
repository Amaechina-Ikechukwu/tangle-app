import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Step1 = ({ username, setUsername, nextStep, step }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your User Name"
          style={styles.input}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorinzontal: 20,
    marginBottom: 7,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FF355E",
    padding: 15,
    marginBottom: 10,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  inputImage: {
    width: 250, // Set appropriate width
    height: 250, // Set appropriate height
    marginBottom: 20, // Adjust as needed
  },
  bottomContainer: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    alignItems: "center",
  },
  stepText: {
    color: "#FF355E",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 3,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FF355E",
    borderRadius: 5,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    alignItems: "center",
  },
  nextButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#FF355E",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default Step1;
