// navigators/AppDrawer.js
import { ActivityIndicator, Platform, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/app/Post/HomeScreen";
// import ProfileScreen from '../screens/app/ProfileScreen';
import DiscoveryScreen from "../screens/app/Discovery/DiscoveryScreen";
import MatchesScreen from "../screens/app/Match/MatchesScreen";

// import LocationScreen from '../screens/app/DiscoveryScreen';
import ChatScreen from "../screens/app/Chats/ChatScreen";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import Icon from "react-native-vector-icons/Ionicons"; // Or any other icon set you prefer
import { auth, db } from "../firebase";

import { useEffect, useLayoutEffect, useState } from "react";

import { ChatList } from "../services/Chats/api";
import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";
import {
  equalTo,
  limitToFirst,
  limitToLast,
  off,
  onChildAdded,
  onChildChanged,
  onValue,
  orderByChild,
  orderByKey,
  query,
  ref,
  update,
} from "firebase/database";
import { Modal, Portal } from "react-native-paper";
import { Text, View as Box } from "../Themed";
import { Button } from "galio-framework";
import { GeneralGet } from "../apis/Get/General";
import Colors from "../Colors";
import { navigate } from "./navigationRef";
import { usePushNotification } from "../context/PushNotification";
import { GetProfile } from "../services/Profile/api";
import { GeneralPost } from "../apis/Post/General";
import { useNavigation } from "@react-navigation/native";
const Tab = createBottomTabNavigator();

const DummyScreen = () => null; // This won't be rendered.

function HomeNavigation() {
  const [visible, setVisible] = useState(false);
  const { showNotification } = useNavigation();
  const showModal = () => setVisible(true);
  const hideModal = () => setisprofilecomplete(false);
  const hideEmailModal = () => setIsEmailVerified(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
    gap: 10,
  };
  const [
    setTotalUnread,
    setisprofilecomplete,
    setChatList,
    totalUnread,
    isprofilecomplete,
    isEmailVerified,
    setIsEmailVerified,
  ] = useStore(
    useShallow((state) => [
      state.setTotalUnread,
      state.setisprofilecomplete,
      state.setChatList,
      state.totalUnread,
      state.isprofilecomplete,
      state.isEmailVerified,
      state.setIsEmailVerified,
    ])
  );
  const GetChatList = async () => {
    const { result, unread } = await ChatList({
      token: auth?.currentUser?.uid,
    });

    setChatList(result);
    setTotalUnread(unread);
  };

  const handleUpdate = async ({ chats, members }) => {
    const chatKeys = Object.keys(chats);
    const lastChatKey = chatKeys[chatKeys.length - 1];

    if (Object.keys(members).includes(auth?.currentUser.uid)) {
      const newData = chats[lastChatKey];

      // if (newData.read === false && newData.author !== auth?.currentUser.uid) {
      //   handleNotification(newData);
      // }
      GetChatList();
    }
  };

  useEffect(() => {
    const dmsRef = ref(db, "iec");

    // Set up the listener and store its reference
    const listener = onChildChanged(dmsRef, (snapshot) => {
      console.log("gere");
    });

    // Return a cleanup function to remove the listener when component unmounts
    return () => {
      // Call the off method on the listener reference
      off(dmsRef, "child_added", listener);
    };
  }, []);
  useEffect(() => {
    const dmsRef = ref(db, "dms");

    // Set up the listener and store its reference
    const listener = onChildChanged(dmsRef, (snapshot) => {
      handleUpdate({
        chats: snapshot.val().chats,
        members: snapshot.val().members,
      });
    });

    // Return a cleanup function to remove the listener when component unmounts
    return () => {
      // Call the off method on the listener reference
      off(dmsRef, "child_added", listener);
    };
  }, []);

  const GoToEditProfile = () => {
    setisprofilecomplete(true);
    navigate({ name: "Edit Profile" });
  };
  const GoToEmailVerification = () => {
    setIsEmailVerified(true);
    navigate({ name: "Email Verification" });
  };

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        activeTintColor="#FF6347"
        inactiveTintColor="gray"
        screenOptions={({ route }) => ({
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let iconColor;

            switch (route.name) {
              case "Home":
                iconName = focused ? "home" : "home-outline";
                iconColor = focused ? "white" : "#FF6347";
                break;
              case "Discovery":
                iconName = focused ? "location" : "location-outline";
                iconColor = focused ? "white" : "#FF6347";
                break;
              case "Matches":
                iconName = focused ? "person" : "person-outline";
                iconColor = focused ? "white" : "#FF6347";
                break;
              case "Chat":
                iconName = focused ? "chatbubbles" : "chatbubbles-outline";
                iconColor = focused ? "white" : "#FF6347";
                break;

              // ... add more cases as needed
            }

            // Customizing the icon based on focus state
            const iconStyle = focused
              ? {
                  backgroundColor: "#FF6347",
                  color: "white",
                  padding: 10,
                  borderRadius: 40, // this will make it circular
                  justifyContent: "center",
                  alignItems: "center",
                }
              : {};

            return (
              <View style={iconStyle}>
                <Icon name={iconName} size={size} color={iconColor} />
              </View>
            );
          },
          tabBarItemStyle: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
          tabBarStyle: {
            position: "absolute",
            bottom: 15,
            left: 20,
            right: 20,
            elevation: 20,
            backgroundColor: "white",
            borderRadius: 40, // Rounded corners
            height: 60, // You can adjust this as needed
            paddingBottom: 10,
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerLeft: () => null, // this hides the back button
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Discovery"
          component={DiscoveryScreen}
          options={{ title: null, headerShown: false }}
        />
        <Tab.Screen
          name="Matches"
          component={MatchesScreen}
          options={{ title: null, headerShown: false }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarBadgeStyle: {
              display: totalUnread == 0 ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              margin: 0,
              textAlign: "center",
              fontSize: 16,
            },
            tabBarBadge: totalUnread,
          }}
        />
      </Tab.Navigator>
      {/* <Portal>
        <Modal
          visible={isprofilecomplete == false}
          onDismiss={hideModal}
          contentContainerStyle={{ alignItems: "center", flex: 1 }}
        >
          <View style={containerStyle}>
            <Text>Seems you have uncompleted profile</Text>
            <Button onPress={GoToEditProfile} color={Colors.light.acccent}>
              Go to Profile
            </Button>
          </View>
        </Modal>
      </Portal>
      <Portal>
        <Modal
          visible={isEmailVerified == false}
          onDismiss={hideEmailModal}
          contentContainerStyle={{ alignItems: "center", flex: 1 }}
        >
          <View style={containerStyle}>
            <Text inverse={true}>Seems you email is not yet verified</Text>
            <Button
              onPress={GoToEmailVerification}
              color={Colors.light.acccent}
            >
              Verify Email Now
            </Button>
          </View>
        </Modal>
      </Portal> */}
    </>
  );
}

export default HomeNavigation;
