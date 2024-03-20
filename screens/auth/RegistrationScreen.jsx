import React, { useState, ActivityIndicator } from "react";
import { View, StyleSheet } from "react-native";

import Step1 from "./registrationSteps/Step1";
import Step2 from "./registrationSteps/Step2";
import Step3 from "./registrationSteps/Step3";
import Step4 from "./registrationSteps/Step4";
import Step5 from "./registrationSteps/Step5";
import Step6 from "./registrationSteps/Step6";
import Step7 from "./registrationSteps/Step7";
import Step8 from "./registrationSteps/Step8";
import Step9 from "./registrationSteps/Step9";
import CompletionStep from "./registrationSteps/CompletionStep";

import { useNavigation } from "@react-navigation/native";
import { useNotification } from "../../context/Notifications";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase";
import { GeneralPost } from "../../apis/Post/General";
import { GeneralGet } from "../../apis/Get/General";

const RegistrationScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    age: 1,
    gender: "",
    interest: [],
    bio: "",
    password: "",
    confirmPassword: "",
    imageurl: "",
  });

  const { showNotification } = useNotification();

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      showNotification("Signing Up, please wait");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      await GeneralPost("profile/adduser", user.uid, formData);
      await GeneralPost("profile/verfiyemail", user.uid, {
        email: formData.email,
      });
      showNotification(
        "Click on the link sent to your email inbox to verify your email"
      );
      navigation.navigate("Home Navigation");
    } catch (error) {
      console.log(error);
      showNotification("Could not register you at the moment");
      // Handle error as needed
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    // Validate the current step before proceeding
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleRestart = () => {
    navigation.navigate("Login");
  };

  return (
    <>
      <View style={styles.container}>
        {step === 1 && (
          <Step1
            username={formData.username}
            setUsername={(username) => setFormData({ ...formData, username })}
            nextStep={nextStep}
            step={step}
          />
        )}

        {step === 2 && (
          <Step2
            name={formData.fullName}
            setName={(name) => setFormData({ ...formData, fullName: name })}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
          />
        )}

        {step === 3 && (
          <Step3
            email={formData.email}
            setEmail={(email) => setFormData({ ...formData, email })}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
          />
        )}

        {step === 4 && (
          <Step4
            age={formData.age}
            setAge={(age) => setFormData({ ...formData, age })}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
          />
        )}

        {step === 5 && (
          <Step5
            gender={formData.gender}
            setGender={(gender) => setFormData({ ...formData, gender })}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
          />
        )}

        {step === 6 && (
          <Step6
            interests={formData.interest}
            setInterests={(interest) => setFormData({ ...formData, interest })}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
          />
        )}

        {step === 7 && (
          <Step7
            bio={formData.bio}
            setBio={(bio) => setFormData({ ...formData, bio })}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
          />
        )}

        {step === 8 && (
          <Step8
            bio={formData.imageurl}
            setImages={(imageurl) => setFormData({ ...formData, imageurl })}
            nextStep={nextStep}
            prevStep={prevStep}
            step={step}
          />
        )}

        {step === 9 && (
          <Step9
            password={formData.password}
            confirmPassword={formData.confirmPassword}
            setPassword={(password) => setFormData({ ...formData, password })}
            setConfirmPassword={(confirmPassword) =>
              setFormData({ ...formData, confirmPassword })
            }
            prevStep={prevStep}
            step={step}
            handleSubmit={handleSubmit}
          />
        )}

        {step === 10 && <CompletionStep onRestart={handleRestart} />}

        {/* {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#f62459" />
        </View>
      )} */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
});

export default RegistrationScreen;
