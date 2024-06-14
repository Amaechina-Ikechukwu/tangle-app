import React, { useState, ActivityIndicator, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import Step1 from "./registrationSteps/Step1";
import Step2 from "./registrationSteps/Step2";
import Step3 from "./registrationSteps/Step3";
import Step4 from "./registrationSteps/Step4";
import Step5 from "./registrationSteps/Step5";
import Step6 from "./registrationSteps/Step6";
import Step7 from "./registrationSteps/Step7";
import Step8 from "./registrationSteps/Step8";

import { useStore } from "../../../../store/store";
import { useShallow } from "zustand/react/shallow";
import { GeneralPost } from "../../../../apis/Post/General";
import { useNotification } from "../../../../context/Notifications";
import { Button } from "galio-framework";
import Colors from "../../../../Colors";
import { auth } from "../../../../firebase";
import { GetProfile } from "../../../../services/Profile/api";

const EditProfile = ({ navigation }) => {
  const [currentUser, setCurrentUser, setisprofilecomplete] = useStore(
    useShallow((state) => [
      state.currentUser,
      state.setCurrentUser,
      state.setisprofilecomplete,
    ])
  );
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    fullName: currentUser?.fullName || auth.currentUser?.displayName || "",
    email: currentUser?.email || auth.currentUser?.email || "",
    age: currentUser?.age || 1,
    gender: currentUser?.gender || "",
    interest: currentUser?.interest || [],
    bio: currentUser?.bio || "",

    imageurl: currentUser?.imageurl || auth.currentUser?.photoURL || "",
  });

  const { showNotification } = useNotification();
  const validateEmail = () => {
    // Regular expression for validating email addresses

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!formData.email) {
      showNotification("Please enter an email address.");
      return false; // Exit early if there's no email
    }

    if (!emailRegex.test(formData.email)) {
      showNotification("Please enter a valid email address.");
      return; // Exit early if the email doesn't match the pattern
    }
  };
  const handleSubmit = async () => {
    if (validateEmail() == false) {
      showNotification("Add correct email");
      return false;
    }

    try {
      showNotification("Updating");

      await GeneralPost("profile/adduser", auth.currentUser.uid, formData);
      showNotification("Updated");
      const profile = await GetProfile({
        token: auth.currentUser.uid,
        body: { user: auth.currentUser.uid },
      });
      setCurrentUser(profile.result);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      showNotification("Could update profile at the moment");
      // Handle error as needed
    } finally {
      setIsLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      // Add event listener for navigation events
      const unsubscribe = navigation.addListener("beforeRemove", (e) => {
        // Prevent default behavior of navigation (e.g., closing the screen)

        if (
          formData.username.length == 0 ||
          formData.interest.length == 0 ||
          formData.age < 18 ||
          formData.gender.length == 0
        ) {
          setisprofilecomplete(false);
        }
      });

      // Cleanup function to remove the event listener
      return () => unsubscribe();
    }, [navigation, formData]) // Depend on navigation to re-subscribe to the event listener when navigation changes
  );
  const usernameInput = (event) => {
    if (formData.username.length > 0) {
      showNotification("Username can not be changed");
      return;
    }
    setFormData({ ...formData, username: event.toLowerCase() });
  };
  return (
    <>
      <KeyboardAvoidingView>
        <ScrollView style={styles.container}>
          <Step8
            image={formData.imageurl}
            setImages={(imageurl) => setFormData({ ...formData, imageurl })}
            step={step}
          />
          <Step7
            bio={formData.bio}
            setBio={(bio) => setFormData({ ...formData, bio })}
            step={step}
          />
          <Step1
            username={formData.username}
            setUsername={usernameInput}
            step={step}
          />

          <Step2
            name={formData.fullName}
            setName={(name) => setFormData({ ...formData, fullName: name })}
            step={step}
          />

          <Step3
            email={formData.email}
            setEmail={(email) =>
              showNotification(
                "Go to settings, click 'Email' to make your changes"
              )
            }
            step={step}
          />

          <Step4
            age={formData.age}
            setAge={(age) => setFormData({ ...formData, age })}
            step={step}
          />

          <Step5
            gender={formData.gender}
            setGender={(gender) => setFormData({ ...formData, gender })}
            step={step}
          />

          <Step6
            interests={formData.interest}
            setInterests={(interest) => setFormData({ ...formData, interest })}
            step={step}
          />
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Button
              style={{ borderRadius: 0, width: "100%" }}
              color={Colors.light.acccent}
              onPress={handleSubmit}
            >
              Update Profile
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    height: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
});

export default EditProfile;
