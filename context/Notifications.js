import React, { ReactNode, createContext, useContext, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Dimensions,
} from "react-native";
import { Text, View } from "../Themed";
import Colors from "../Colors";

const NotificationContext = createContext();

// Custom notification component
const Notification = ({ message, onClose }) => {
  const [offsetY, setOffsetY] = useState(0);

  const handlePanResponderMove = (_, gestureState) => {
    if (gestureState.dy < 0) {
      setOffsetY(gestureState.dy);
    }
  };

  const handlePanResponderRelease = (_, gestureState) => {
    if (gestureState.dy < -50) {
      onClose();
    } else {
      setOffsetY(0);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: handlePanResponderRelease,
  });

  return (
    <View
      style={{ width: "90%", alignItems: "center", justifyContent: "center" }}
    >
      <View
        style={[styles.notification, { transform: [{ translateY: offsetY }] }]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.notificationText}>{message}</Text>
        <TouchableOpacity></TouchableOpacity>
      </View>
    </View>
  );
};

// Context Provider
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {notification && (
        <View
          style={{
            position: "absolute",
            bottom: 10,
            alignItems: "center",
            left: 0,
            right: 0,
            zIndex: 999,
            backgroundColor: Colors.dark.text,
          }}
        >
          <Notification
            message={notification}
            onClose={() => setNotification(null)}
          />
        </View>
      )}
    </NotificationContext.Provider>
  );
};

// Hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

// Styles
const styles = StyleSheet.create({
  notification: {
    borderRadius: 8,
    padding: 16,
    width: Dimensions.get("window").width - 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
