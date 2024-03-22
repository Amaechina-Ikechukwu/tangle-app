import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "../../../Colors";

const Step9 = ({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  handleSubmit,
  prevStep,
  step,
}) => {
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleNext = () => {
    if (validatePassword()) {
      handleSubmit();
    } else {
      Alert.alert("Validation Error", "Please make sure the passwords match.");
    }
  };

  //   const handleSubmit = async() => {
  //     alert('working')
  //   }

  // Calculate progress
  const totalSteps = 9; // Total number of steps
  const progress = (step / totalSteps) * 100;

  return (
    <View style={styles.container}>
      {/* Image related to inputs */}
      <Image
        source={require("../../../assets/images/register/08.png")} // Replace with your image URL or local image path
        style={styles.inputImage}
      />

      <Text style={styles.title}>Create a Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          cursorColor={Colors.light.acccent}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry={true}
          style={styles.input}
        />
        <TextInput
          cursorColor={Colors.light.acccent}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry={true}
          style={styles.input}
        />
        <Text style={styles.errorText}>{passwordError}</Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={prevStep}>
        <Icon name="arrow-left" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <Text style={styles.stepText}>
          Step {step} of {totalSteps}
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  stepIndicators: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  stepIndicator: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#FF355E",
    borderWidth: 2,
  },
  filledStepIndicator: {
    backgroundColor: "#FF355E",
  },
  stepText: {
    color: "#FF355E",
    fontSize: 16,
    fontWeight: "bold",
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
    paddingRight: 40,
    marginBottom: 10,
    width: "100%",
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

  submitButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#FF355E",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  inputImage: {
    width: 250, // Set appropriate width
    height: 250, // Set appropriate height
    marginBottom: 20, // Adjust as needed
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
});

export default Step9;
