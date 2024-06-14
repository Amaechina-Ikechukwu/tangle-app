import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";
import { CustomTextInput } from "../../Themed";
import Colors from "../../Colors";
import { auth } from "../../firebase";
import { useNotification } from "../../context/Notifications";
import { GeneralPost } from "../../apis/Post/General";

export default function VerifyEmail() {
  const provider = auth.currentUser.providerData[0].providerId;

  const [currentUser] = useStore(useShallow((state) => [state.currentUser]));
  const [disabled, setDisable] = useState(false);
  const { showNotification } = useNotification();

  const verifyEmail = async () => {
    try {
      await GeneralPost("profile/verfiyemail", auth.currentUser.uid, {
        email: currentUser.email,
      });
      showNotification("Check your email to verify, and then relaunch the app");
    } catch {
      showNotification("Please ensure your email is correct");
    }
  };
  if (provider !== "password") {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 18, textAlign: "center" }}>
          You used google login, your email has been verified
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Verify Email</Text>
      <CustomTextInput
        style={{ width: "100%" }}
        value={currentUser?.email}
        placeholder="Current email"
      />

      <TouchableOpacity
        style={styles.button}
        disabled={disabled}
        onPress={() => verifyEmail()}
      >
        <Text style={{ color: "white" }}>Proceed with verification</Text>
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
