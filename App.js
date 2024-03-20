import { StyleSheet, Text, View } from "react-native";
import React from "react";
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

import { NotificationProvider } from "./context/Notifications";

export default function App() {
  const modalConfig = { ErrorModal };
  const defaultOptions = { backdropOpacity: 0.6 };

  const modalStack = createModalStack(modalConfig, defaultOptions);

  return (
    <PaperProvider>
      <NotificationProvider>
        <StatusBar />

        <ModalProvider stack={modalStack}>
          <NavigationContainer ref={navigationRef}>
            <MainNavigator />
          </NavigationContainer>
        </ModalProvider>
      </NotificationProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
