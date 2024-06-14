import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker"; // Import the Picker component

const Step4 = ({ age, setAge, nextStep, prevStep, step }) => {
  const [error, setError] = useState("");
  const [isPickerVisible, setPickerVisibility] = useState(false); // State to control the visibility of the picker

  const validateAge = () => {
    const ageNum = parseInt(age, 10);
    if (!age) {
      setError("Please enter your age.");
      return;
    }

    if (isNaN(ageNum) || ageNum < 18) {
      setError("You must be at least 18 years old.");
      return;
    }

    setError("");
    nextStep();
  };

  // Generate a list of age numbers for the picker
  const ageNumbers = Array.from({ length: 100 }, (_, i) => i + 1);

  // Calculate progress
  const totalSteps = 7; // Total number of steps
  const progress = (step / totalSteps) * 100;
  useEffect(() => {}, [age]);
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/register/04.png")} // Replace with your image URL or local image path
        style={styles.inputImage}
      />
      <Text style={styles.title}>What is your age?</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setPickerVisibility(true)}
      >
        <Text style={styles.inputText}>{age || "Enter your age"}</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal visible={isPickerVisible} transparent={true} animationType="slide">
        <View style={styles.pickerModal}>
          <Picker
            selectedValue={age}
            onValueChange={(itemValue) => setAge(itemValue.toString())}
            style={styles.picker}
          >
            {ageNumbers.map((number) => (
              <Picker.Item
                key={number}
                label={number.toString()}
                value={number.toString()}
              />
            ))}
          </Picker>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => setPickerVisibility(false)}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.bottomContainer}>
        <Text style={styles.stepText}>
          Step {step} of {totalSteps}
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={prevStep}>
        <Icon name="arrow-left" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.nextButton} onPress={validateAge}>
        <Icon name="arrow-right" size={20} color="white" />
      </TouchableOpacity>
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
    marginRight: 10,
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
    flexDirection: "row",
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
  calendarIconContainer: {
    position: "absolute",
    right: 10,
    alignItems: "center",
  },
  calendarIcon: {
    alignSelf: "center",
    marginBottom: 10,
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
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#FF355E",
    padding: 15,
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
  },
  pickerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  picker: {
    width: "100%",
    backgroundColor: "white",
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
  confirmButton: {
    backgroundColor: "#FF355E",
    padding: 10,
    marginTop: 10,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
  },
  inputImage: {
    width: 250, // Set appropriate width
    height: 250, // Set appropriate height
    marginBottom: 20, // Adjust as needed
  },
});

export default Step4;
