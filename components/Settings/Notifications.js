import React, { useEffect, useState, useRef } from "react";
import { View, Button, Platform, Text } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useNotification } from "../../context/Notifications";

export default function NotificationsComponent() {
  const [error, setError] = useState("");
  const { showNotification } = useNotification();
  async function registerForPushNotificationsAsync() {
    showNotification(`register function`);
    try {
      const { data: pushTokenString } =
        await Notifications.getExpoPushTokenAsync({
          projectId:
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId,
        });

      return pushTokenString;
    } catch (e) {
      const error = JSON.stringify(e);
      setError(error);
      showNotification(`${JSON.stringify(e)}`);
    }
  }
  async function registerForExpoPushNotificationsAsync() {
    showNotification(`register function`);
    try {
      const { data: pushTokenString } =
        await Notifications.getDevicePushTokenAsync({
          applicationId: "1:340066696598:android:5022b7244a4ffbf871f1b7",
        });

      return pushTokenString;
    } catch (e) {
      const error = JSON.stringify(e);
      setError(error);
      showNotification(`${JSON.stringify(e)}`);
    }
  }
  const [expoPushToken, setExpoPushToken] = useState("");

  const [notification, setNotification] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => console.error(error)); // You might want to handle this error more gracefully
    registerForExpoPushNotificationsAsync()
      .then((token) => setNotification(token ?? ""))
      .catch((error) => console.error(error)); // You might want to handle this error more gracefully

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleToken = async (token) => {
    notificationListener.current &&
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    responseListener.current &&
      Notifications.removeNotificationSubscription(responseListener.current);
  };

  const turnNotificationsOff = async () => {
    // Unsubscribe from notifications
    await Notifications.removePushTokenSubscription(handleToken);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{expoPushToken}</Text>
      <Text>{projectId}</Text>
      <Text>{notification}</Text>
      <Button title="Turn notifications off" onPress={turnNotificationsOff} />
    </View>
  );
}
