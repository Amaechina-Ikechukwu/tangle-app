import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const listInterests = [
  { id: 1, label: "Traveling", icon: "plane" },
  { id: 2, label: "Movies", icon: "film" },
  { id: 3, label: "Music", icon: "music" },
  { id: 4, label: "Foodie", icon: "spoon" },
  { id: 5, label: "Outdoor Activities", icon: "odnoklassniki" },
  { id: 6, label: "Sports", icon: "soccer-ball-o" },
  { id: 7, label: "Cooking", icon: "cutlery" },
  { id: 8, label: "Reading", icon: "book" },
  { id: 9, label: "Art & Culture", icon: "paint-brush" },
  { id: 10, label: "Gaming", icon: "gamepad" },
  { id: 11, label: "Fitness", icon: "heartbeat" },
  { id: 12, label: "Dancing", icon: "music" },
  // Add more interests as necessary...
];

const Step6 = ({ interests, setInterests, nextStep, prevStep, step }) => {
  const handleInterestToggle = (interestLabel) => {
    // Check if the interest is already selected
    if (interests.includes(interestLabel)) {
      // If it's selected, remove it from the selected interests
      setInterests(interests.filter((label) => label !== interestLabel));
    } else {
      // If it's not selected, add it to the selected interests
      setInterests([...interests, interestLabel]);
    }
  };
  // Calculate progress
  const totalSteps = 7; // Total number of steps
  const progress = (step / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select You Interests</Text>
      <View style={styles.interestsContainer}>
        {listInterests.map((interest) => (
          <TouchableOpacity
            key={interest.id}
            style={[
              styles.interestButton,
              interests.includes(interest.label) &&
                styles.interestButtonSelected,
            ]}
            onPress={() => handleInterestToggle(interest.label)}
          >
            {interests.includes(interest.label) ? (
              <Icon name={interest.icon} size={14} color="#fff" /> // Change color for selected interest
            ) : (
              <Icon name={interest.icon} size={14} color="#000" /> // Default color for unselected interest
            )}

            <Text
              style={[
                styles.interestLabel,
                interests.includes(interest.label) &&
                  styles.interestLabelSelected,
              ]}
            >
              {interest.label}
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
  inputImage: {
    width: 250, // Set appropriate width
    height: 250, // Set appropriate height
    marginBottom: 20, // Adjust as needed
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // this is the key prop here
    alignItems: "center",
    justifyContent: "center",
  },
  interestButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ececec",
    borderColor: "#FF355E",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 5,
    margin: 2,
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
  interestButtonSelected: {
    backgroundColor: "#FF355E",
  },
  interestLabel: {
    marginLeft: 5,
    color: "#000",
    fontWeight: "bold",
  },
  interestLabelSelected: {
    color: "#FFF",
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
});

export default Step6;
