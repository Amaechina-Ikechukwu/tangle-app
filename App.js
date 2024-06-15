import React, { useEffect, useState } from "react";
import { StatusBar, Text } from "react-native";
import { AppRegistry } from "react-native";
import { PaperProvider } from "react-native-paper";
import "react-native-gesture-handler";

// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigations/navigationRef";
import MainNavigator from "./navigations";

// Modal Provider Block
import { ModalProvider, createModalStack } from "react-native-modalfy";

// Modals
import ErrorModal from "./components/modals/ErrorModal";
import { registerRootComponent } from "expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import { NotificationProvider } from "./context/Notifications";
import { PushNotificationProvider } from "./context/PushNotification";
import * as Linking from "expo-linking";

export default function App() {
  const [hasError, setHasError] = useState(false);
  const modalConfig = { ErrorModal };
  const defaultOptions = { backdropOpacity: 0.6 };
  let modalStack;

  try {
    modalStack = createModalStack(modalConfig, defaultOptions);
  } catch (error) {
    console.error("Error creating modal stack:", error);
    setHasError(true);
  }

  useEffect(() => {
    try {
      Linking.addEventListener("url", handleDeepLink);
    } catch (error) {
      console.error("Error adding event listener for deep link:", error);
      // Handle error gracefully
    }

    return () => {
      try {
        Linking.removeEventListener("url", handleDeepLink);
      } catch (error) {
        console.error("Error removing event listener for deep link:", error);
        // Handle error gracefully
      }
    };
  }, []);

  const handleDeepLink = async (event) => {
    try {
      // Handle deep link events here
    } catch (error) {
      console.error("Error handling deep link:", error);
      // Handle error gracefully
    }
  };

  let appurl;

  try {
    appurl = Linking.createURL("");
  } catch (error) {
    console.error("Error creating app URL:", error);
    // Handle error gracefully, set a default value, etc.
    appurl = "";
  }

  if (hasError) {
    // Render fallback UI or error message
    return (
      <PaperProvider>
        <Text>Error</Text>
      </PaperProvider>
    );
  }
  try {
    return (
      <PaperProvider>
        <StripeProvider
          publishableKey={process.env.EXPO_PUBLIC_PUBLISHABLE_KEY}
          urlScheme={appurl} // required for 3D Secure and bank redirects
          merchantIdentifier="merchant.com.tangles" // required for Apple Pay
        >
          <NotificationProvider>
            <PushNotificationProvider>
              <StatusBar />
              {modalStack && (
                <ModalProvider stack={modalStack}>
                  <NavigationContainer ref={navigationRef}>
                    <MainNavigator />
                  </NavigationContainer>
                </ModalProvider>
              )}
            </PushNotificationProvider>
          </NotificationProvider>
        </StripeProvider>
      </PaperProvider>
    );
  } catch (error) {
    <PaperProvider>
      <Text>{JSON.parse(error)}</Text>
    </PaperProvider>;
  }
}
registerRootComponent(App);
