import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { GeneralPost } from "../apis/Post/General";
import { ref, update } from "firebase/database";
import { auth } from "../firebase";
import { useNotification } from "./Notifications";
import { navigate } from "../navigations/navigationRef";
import { currentUser } from "../components/currentUser";
import * as Linking from "expo-linking";
// Create a context for managing push notifications
const PushNotificationContext = createContext();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Function to send push notification
async function sendPushNotification(expoPushToken, data) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: data.fullName,
    body: data?.message,
    data: { ...data },
    attachment: {
      url: data.imageurl,
    },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
const Updatetoken = async ({ token }) => {
  try {
    await GeneralPost("notifications/addtoken", auth?.currentUser.uid, {
      token,
    });
    if (auth?.currentUser.uid) {
      update(ref(db, "notificationtokens/" + auth?.currentUser.uid), {
        ...token,
      });
    }
  } catch {}
};
async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId:
        Constants.expoConfig.extra.eas.projectId ??
        Constants?.easConfig?.projectId,
    });
    await Updatetoken({ token });
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  return token.data;
}

// Provider component to wrap your app and provide the push notification context
export function PushNotificationProvider({ children }) {
  const [token, setToken] = useState("");
  const sendNotification = async (data) => {
    const expoPushToken = await registerForPushNotificationsAsync();

    await sendPushNotification(expoPushToken, data);
  };

  // Expose context value
  const contextValue = {
    sendNotification,
  };
  const GetToken = async () => {
    const expoPushToken = await registerForPushNotificationsAsync();
    setToken(expoPushToken);
  };
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const handleNotificationResponse = async (response) => {
      const data = response.notification.request.content.data;

      navigate({ name: data?.path, params: { ...data?.params } });
    };

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // Handle notification received
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );

    // Handle deep links when app is opened from a killed state
    const handleDeepLink = (event) => {
      const url = event.url;
      const { path, queryParams } = Linking.parse(url);
      console.log({ path, queryParams });
      navigate({ name: path, params: queryParams });
    };

    Linking.addEventListener("url", handleDeepLink);

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  useEffect(() => {
    GetToken();
  }, [token]);

  return (
    <PushNotificationContext.Provider value={{ sendNotification, token }}>
      {children}
    </PushNotificationContext.Provider>
  );
}

// Hook to use push notification context
export function usePushNotification() {
  return useContext(PushNotificationContext);
}
