import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";
import { CustomTextInput } from "../../Themed";
import Colors from "../../Colors";
import { auth, db } from "../../firebase";
import { useNotification } from "../../context/Notifications";
import { signInWithEmailAndPassword } from "firebase/auth";
import { GeneralPost } from "../../apis/Post/General";
import { GeneralPatch } from "../../apis/Patch/General";
import { off, onChildChanged, onValue, ref } from "firebase/database";
import { GeneralGet } from "../../apis/Get/General";
import { GetProfile } from "../../services/Profile/api";
import { navigate } from "../../navigations/navigationRef";

export default function ChangeEmail() {
  const provider = auth.currentUser.providerData[0].providerId;
  const [inputs, setInputs] = useState({
    newEmail: "",
    password: "",
  });
  const [initialized, setInitialized] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { newEmail, password } = inputs;
  const [currentUser, setCurrentUser] = useStore(
    useShallow((state) => [state.currentUser, state.setCurrentUser])
  );
  const [disabled, setDisable] = useState(false);
  const { showNotification } = useNotification();
  useEffect(() => {
    if (
      newEmail.length === 0 ||
      (provider == "password" && password.length === 0)
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [newEmail, password]);
  const isEmailChangeInitialzied = async () => {
    const { result } = await GeneralGet(
      `accounts/intializations?type=email`,
      currentUser?.userKey
    );
    if (result == true) {
      setInitialized(result);
    } else {
      showNotification(
        "Please ensure you clicked on the link provided in the email"
      );
    }
  };
  useEffect(() => {}, [initialized, emailSent]);
  const changeEmail = async () => {
    const body = { newEmail };
    try {
      await GeneralPatch(
        `accounts/changeemail?newEmail=${newEmail}`,
        auth?.currentUser?.uid
      );
      const { result } = await GetProfile({
        token: currentUser?.userKey,
        body: { user: currentUser?.userKey },
      });
      showNotification("Setting up...");
      setCurrentUser(result);
      showNotification("Check your new email to verify new email");
    } catch (error) {
      console.log(error);
      showNotification(
        "Please ensure your new email and current password is correct"
      );
    }
  };
  const initializeEmailChange = async () => {
    try {
      const { result } = await GeneralPost(
        "accounts/emailchangeinitialization",
        auth?.currentUser?.uid,
        {
          email: currentUser?.email,
        }
      );
      setEmailSent(true);
      showNotification(result);
    } catch (error) {
      showNotification(
        "There was an issue sending initialization link to your current email address"
      );
    }
  };
  if (provider !== "password") {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 18, textAlign: "center" }}>
          You used google login, your email cannot be changed at the moment
        </Text>
      </View>
    );
  }
  if (!initialized) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20 }}>Initialize Email Change</Text>
        <CustomTextInput
          style={{ width: "100%" }}
          value={currentUser.email}
          placeholder="Current email"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={emailSent ? isEmailChangeInitialzied : initializeEmailChange}
        >
          <Text style={{ color: "white" }}>
            {emailSent ? "I have checked my email" : "Initialize Email Change"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Change Email</Text>
      <CustomTextInput
        style={{ width: "100%" }}
        value={currentUser.email}
        placeholder="Current email"
      />
      <CustomTextInput
        style={{ width: "100%" }}
        value={newEmail}
        onChange={(text) =>
          setInputs((input) => ({
            ...input,
            newEmail: text.toLowerCase().trim(),
          }))
        }
        placeholder="Enter new email"
      />

      <CustomTextInput
        style={{ width: "100%" }}
        value={password}
        onChange={(text) =>
          setInputs((input) => ({ ...input, password: text }))
        }
        placeholder="Enter password for current email"
      />

      <TouchableOpacity
        style={styles.button}
        disabled={disabled}
        onPress={() => changeEmail()}
      >
        <Text style={{ color: "white" }}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 20,
  },
  button: {
    backgroundColor: Colors.light.acccent,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 10,
  },
});
