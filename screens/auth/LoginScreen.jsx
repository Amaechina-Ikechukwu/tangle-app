import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  View,
  Modal,
} from "react-native";

import { Button, Snackbar, Text, TextInput } from "react-native-paper";

import { useNotification } from "../../context/Notifications";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import GoogleSignIn from "./GoogleSignIn";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [dialog, setDialog] = useState(false);
  const [loginMessage, setLoginMessage] = useState(""); // State to hold login messages
  const [snackbarVisible, setSnackbarVisible] = useState(false); // State to manage Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { showNotification } = useNotification();

  const validateEmail = (inputEmail) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(inputEmail);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      showNotification("Please enter a valid email address.");
      return;
    } else {
      setEmailError("");
    }

    if (!password) {
      showNotification("Password cannot be empty.");
      return;
    } else {
      setPasswordError("");
    }

    showNotification("Logging In");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showNotification("Logged In");
      setEmail("");
      setPassword("");
    } catch (error) {
      showNotification("Invaild login details");
    }
  };
  try {
    return (
      <>
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.textContainer}>
            {/* <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          /> */}
          </View>

          <Text style={styles.header}>
            Login: Unlock the Door to Your Heart. 🔐❤️
          </Text>
          <TextInput
            mode="outlined"
            label="Enter email address"
            value={email}
            onChangeText={setEmail}
            cursorColor="#f91545"
            activeOutlineColor="#f91545"
          />

          {emailError && <Text style={{ color: "red" }}>{emailError}</Text>}
          <Text>{loginMessage}</Text>
          <TextInput
            mode="outlined"
            label="Enter correct password"
            value={password}
            onChangeText={setPassword}
            cursorColor="#f91545"
            activeOutlineColor="#f91545"
            secureTextEntry
          />
          {passwordError && (
            <Text style={{ color: "red" }}>{passwordError}</Text>
          )}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={{ color: "white" }}>Login</Text>
          </TouchableOpacity>

          <View style={styles.hrContainer}>
            <View style={styles.hrLine} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.hrLine} />
          </View>

          <View style={styles.socialLoginContainer}>
            <GoogleSignIn />
            {/* Add other social login buttons here */}
          </View>

          <View style={{ marginBottom: 40, marginLeft: 20, marginRight: 20 }}>
            <Text bold style={{ textAlign: "center" }}>
              Dont have an account?{" "}
              <Text
                style={{ color: "red" }}
                onPress={() => navigation.navigate("SignUp")}
              >
                Sign up
              </Text>
            </Text>
          </View>

          {/* Full Screen Preloader */}
          {isLoading && (
            <Modal transparent animationType="fade" visible={isLoading}>
              <View style={styles.fullScreenLoader}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            </Modal>
          )}

          {/* Snackbar for displaying messages */}
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={Snackbar.DURATION_SHORT}
            action={{
              label: "OK",
              onPress: () => {
                // Do something if needed when Snackbar action button is pressed
              },
            }}
          >
            {snackbarMessage}
          </Snackbar>
        </KeyboardAvoidingView>
      </>
    );
  } catch (error) {
    return (
      <View>
        <Text>{JSON.parse(error)}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
    alignContent: "center",
  },

  header: {
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 15,
  },

  loginButtonText: {
    color: "#ffffff",
  },

  logo: {
    width: 150, // Or another size you want
    height: 150,
    marginBottom: 50,
  },

  textContainer: {
    marginRight: 20,
    alignItems: "center",
  },

  googleButton: {
    width: "100%", // Full-width
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  loginButton: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#f91545",
    width: "100%",
    borderRadius: 5,
  },

  logoContainer: {
    marginTop: 30,
  },

  hrContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },

  hrLine: {
    flex: 1,
    height: 1,
    backgroundColor: "black",
  },

  orText: {
    marginHorizontal: 10,
  },

  iconButton: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 30,
    backgroundColor: "#FFFFFF", // Change background color if needed
    elevation: 2, // Optional, for shadow effect
  },

  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },

  fullScreenLoader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
});

export default LoginScreen;
