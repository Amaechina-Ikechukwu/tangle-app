import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "../../../Colors";
import {
  endAt,
  onValue,
  orderByChild,
  query,
  ref,
  startAt,
} from "firebase/database";
import { db } from "../../../firebase";
import { GeneralGet } from "../../../apis/Get/General";
import { useNotification } from "../../../context/Notifications";

const Step1 = ({ username, setUsername, nextStep, step }) => {
  const { showNotification } = useNotification();
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const checkIfUsernameExist = async () => {
    const { result } = await GeneralGet(
      `profile/checkusername?username=${username}`,
      ""
    );
    if (result) {
      setError("Username already exists");
    } else {
      setError("");
    }
  };
  useEffect(() => {
    checkIfUsernameExist();
  }, [username]);

  const handleNextStep = () => {
    let hasError = error.length > 0;

    if (!username) {
      setError("Please enter your username");
    }

    if (!hasError) {
      nextStep(); // Proceed to the next step only if no errors
    } else {
      showNotification(error);
    }
  };

  // Calculate progress
  const totalSteps = 7; // Total number of steps
  const progress = (step / totalSteps) * 100;

  return (
    <View style={styles.container}>
      {/* Image related to inputs */}
      <Image
        source={require("../../../assets/images/register/01.png")} // Replace with your image URL or local image path
        style={styles.inputImage}
      />

      <Text style={styles.title}>What is your username</Text>

      <View style={styles.inputContainer}>
        <TextInput
          cursorColor={Colors.light.acccent}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your User Name"
          style={styles.input}
          maxLength={10}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {/* Progress Bar and Step Text at the Bottom */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
        <Icon name="arrow-right" size={20} color="white" />
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
