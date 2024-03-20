import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Button } from "galio-framework";
import { SocialIcon } from "react-native-elements";
import { Text } from "galio-framework";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import Icon from "react-native-vector-icons/Ionicons"; // Using Ionicons as an example
import GoogleSignIn from "./GoogleSignIn";
// import * as Facebook from 'expo-facebook';

const SignupScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);

  const handleGoogleSignup = () => {
    // Implement Google signup logic
  };

  const handleFacebookSignup = async () => {
    setLoading(true); // Show loading overlay
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome to Tangle!</Text>
        <Text>Sign up with</Text>
      </View>

      <Button
        shadowless
        round
        onPress={() => navigation.navigate("Registration")}
        color="#ececec"
        style={styles.loginButton}
      >
        <Text bold>Sign up with Email</Text>
      </Button>

      {/* <Button
        shadowless
        round
        onPress={() => navigation.navigate("Registration")}
        color="#ececec"
        style={styles.loginButton}
      >
        <Text bold>Sign up phone</Text>
      </Button> */}

      <View style={styles.hrContainer}>
        <View style={styles.hrLine} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.hrLine} />
      </View>

      <View style={styles.socialLoginContainer}>
        <GoogleSignIn />
      </View>

      <View style={{ marginBottom: 40, marginLeft: 20, marginRight: 20 }}>
        <Text bold style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Text
            color="red"
            onPress={() => navigation.navigate("Login")}
            style={{ fontWeight: "bold" }}
          >
            Sign in
          </Text>
        </Text>
      </View>

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#f62459" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },

  logoContainer: {
    alignItems: "center",
    width: "100%",
  },

  logo: {
    width: 100,
    height: 150,
    marginBottom: 50,
  },

  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
  },

  loginButtonContainer: {
    width: "100%",
    marginTop: 20,
  },

  loginButton: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loginButtonText: {
    fontWeight: "bold",
    color: "white",
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

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },

  iconButton: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 30,
    backgroundColor: "#FFFFFF", // Change background color if needed
    elevation: 2, // Optional, for shadow effect
  },
});

export default SignupScreen;
