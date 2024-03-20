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

const Step3 = ({ email, setEmail, nextStep, prevStep, step }) => {
  const [error, setError] = useState("");

  const validateEmail = () => {
    // Regular expression for validating email addresses

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!email) {
      setError("Please enter an email address.");
      return; // Exit early if there's no email
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return; // Exit early if the email doesn't match the pattern
    }

    setError(""); // Clear any previous errors
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  backButton: {
    position: "absolute",
    left: 20,
    bottom: 20,
    backgroundColor: "#FF355E",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
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

export default Step3;
