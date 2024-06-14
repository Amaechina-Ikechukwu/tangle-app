import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "../../../../../Colors";

const genders = [
  { id: "male", label: "Male", icon: "male" },
  { id: "female", label: "Female", icon: "female" },
  { id: "other", label: "Other", icon: "genderless" },
];

const Step5 = ({ gender, setGender, nextStep, prevStep, step }) => {
  // Calculate progress
  const totalSteps = 7; // Total number of steps
  const progress = (step / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", marginBottom: 3 }}>
        <Text style={{ color: Colors.light.text }}>Select Gender:</Text>
      </View>
      <View style={styles.genderContainer}>
        {genders.map((gen) => (
          <TouchableOpacity
            key={gen.id}
            style={[
              styles.genderButton,
              gender === gen.id ? styles.genderButtonSelected : null,
            ]}
            onPress={() => setGender(gen.id)}
          >
            <Icon
              name={gen.icon}
              size={24}
              color={gender === gen.id ? "#FFF" : "gray"}
            />
            <Text
              style={[
                styles.genderLabel,
                gender === gen.id ? styles.genderLabelSelected : null,
              ]}
            >
              {gen.label}
            </Text>
          </TouchableOpacity>
        ))}
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
  stepIndicators: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  stepIndicator: {
    width: 10,
    height: 10,

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
  genderContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  genderButton: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: "gray",
  },
  genderButtonSelected: {
    backgroundColor: "#FF355E",
    borderColor: "#FF355E",
  },
  genderLabel: {
    marginTop: 5,
    fontSize: 16,
    color: "gray",
  },
  genderLabelSelected: {
    color: "white",
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

  bottomContainer: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    alignItems: "center",
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
  inputImage: {
    width: 250, // Set appropriate width
    height: 250, // Set appropriate height
    marginBottom: 20, // Adjust as needed
  },
});

export default Step5;
