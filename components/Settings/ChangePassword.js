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

export default function ChangePassword() {
  const provider = auth.currentUser.providerData[0].providerId;
  const [inputs, setInputs] = useState({
    oldpassword: "",
    newpassword: "",
  });
  const [initialized, setInitialized] = useState(false);
  const [passwordSent, setPasswordSent] = useState(false);
  const { oldpassword, newpassword } = inputs;
  const [currentUser, setCurrentUser] = useStore(
    useShallow((state) => [state.currentUser, state.setCurrentUser])
  );
  const [disabled, setDisable] = useState(false);
  const { showNotification } = useNotification();
  useEffect(() => {
    if (
      newpassword.length === 0 ||
      (provider == "password" && oldpassword.length === 0)
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [oldpassword, newpassword]);
  const isEmailChangeInitialzied = async () => {
    const { result } = await GeneralGet(
      `accounts/intializations?type=password`,
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
  useEffect(() => {}, [initialized, passwordSent]);
  const changeEmail = async () => {
    try {
      showNotification("Setting up...");
      await GeneralPatch(
        `accounts/changepassword?newPassword=${newpassword}`,
        auth?.currentUser?.uid
      );

      showNotification("Changed successfully");
    } catch (error) {
      console.log(error);
      showNotification(
        "Please ensure your new and current password is correct"
      );
    }
  };
  const initializeEmailChange = async () => {
    try {
      const { result } = await GeneralPost(
        "accounts/passwordchangeinitialization",
        auth?.currentUser?.uid,
        {
          email: currentUser?.email,
        }
      );
      setPasswordSent(true);
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
          You used google login, your password cannot be changed at the moment
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
          onPress={
            passwordSent ? isEmailChangeInitialzied : initializeEmailChange
          }
        >
          <Text style={{ color: "white" }}>
            {passwordSent
              ? "I have checked my email"
              : "Initialize Password Change"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Change Password</Text>
      <CustomTextInput
        style={{ width: "100%" }}
        value={currentUser.email}
        placeholder="Current email"
      />
      <CustomTextInput
        style={{ width: "100%" }}
        value={oldpassword}
        onChange={(text) =>
          setInputs((input) => ({
            ...input,
            oldpassword: text.toLowerCase().trim(),
          }))
        }
        placeholder="Enter old password"
      />
      <CustomTextInput
        style={{ width: "100%" }}
        value={newpassword}
        onChange={(text) =>
          setInputs((input) => ({
            ...input,
            newpassword: text.toLowerCase().trim(),
          }))
        }
        placeholder="Enter new password"
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
