import React, { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as Linking from "expo-linking";
import { useNotification } from "../../context/Notifications";
import { Text, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { auth } from "../../firebase";
WebBrowser.maybeCompleteAuthSession();

const GoogleSignIn = () => {
  const { showNotification } = useNotification();
  useEffect(() => {
    if (Linking) {
      Linking?.addEventListener("url", handleDeepLink);
    }
  }, []);
  // Empty dependency array ensures the effect only runs once during mount

  const handleDeepLink = async (event) => {
    const accessParam = "access_token=";
    const idParam = "id_token=";
    const code = "code=";
    if (event.url.includes(accessParam) && event.url.includes(idParam)) {
      const access_token = event.url.split(accessParam)[1].split("&")[0];
      const id_token = event.url.split(idParam)[1].split("&")[0];
      const codeId = event.url.split(code)[1];
      // Now 'access_token', 'id_token', and 'codeId' contain the extracted values

      await connectToFirebase(id_token);
      return;
      // Close the in-app browser
      // Note: WebBrowser.dismissBrowser(); may not work in some cases
    }
  };

  const connectToFirebase = async (id_token) => {
    try {
      showNotification("Finishing...");
      const credential = GoogleAuthProvider.credential(id_token);
      const result = await signInWithCredential(auth, credential);
      showNotification("Signed In");
      return;
    } catch (error) {
      showNotification("Error Signing In");
    }
  };

  const appurl = Linking.createURL("");
  const handleLogin = async () => {
    showNotification("Redirecting");
    const authEndpoint =
      process.env.EXPO_PUBLIC_API_URL +
      "/profile/auth/google?redirectUri=" +
      appurl;
    WebBrowser.openAuthSessionAsync(authEndpoint);
  };

  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          width: "90%",
          justifyContent: "space-evenly",
          backgroundColor: "white",
          padding: 20,
          borderRadius: 30,
        },
      ]}
      onPress={handleLogin}
    >
      <FontAwesome name="google" size={24} color="#DB4437" />
      <Text>Continue with Google</Text>
    </TouchableOpacity>
  );
};

export default GoogleSignIn;
