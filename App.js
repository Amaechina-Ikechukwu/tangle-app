import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";

import { AppRegistry } from "react-native";
import { PaperProvider } from "react-native-paper";
import "react-native-gesture-handler";

// Navivation
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
import * as Notifications from "expo-notifications";

export default function App() {
  const modalConfig = { ErrorModal };
  const defaultOptions = { backdropOpacity: 0.6 };

  const modalStack = createModalStack(modalConfig, defaultOptions);
  useEffect(() => {
    if (Linking) {
      Linking?.addEventListener("url", handleDeepLink);
    }
  }, []);
  const handleDeepLink = async (event) => {};
  const appurl = Linking.createURL("");

  return (
    // <PaperProvider>
    //   <StripeProvider
    //     publishableKey={process.env.EXPO_PUBLIC_PUBLISHABLE_KEY}
    //     urlScheme={appurl} // required for 3D Secure and bank redirects
    //     merchantIdentifier="merchant.com.tangles" // required for Apple Pay
    //   >
    <NotificationProvider>
      <PushNotificationProvider>
        <StatusBar />

        {/* <ModalProvider stack={modalStack}> */}
        <NavigationContainer ref={navigationRef}>
          <MainNavigator />
        </NavigationContainer>
        {/* </ModalProvider> */}
      </PushNotificationProvider>
    </NotificationProvider>
    //   </StripeProvider>
    // </PaperProvider>
  );
}

registerRootComponent(App);
