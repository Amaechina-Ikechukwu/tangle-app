// navigators/AppDrawer.js
import { ActivityIndicator, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/app/HomeScreen";
// import ProfileScreen from '../screens/app/ProfileScreen';
import DiscoveryScreen from "../screens/app/DiscoveryScreen";
import MatchesScreen from "../screens/app/MatchesScreen";

// import LocationScreen from '../screens/app/DiscoveryScreen';
import ChatScreen from "../screens/app/ChatScreen";
import BillingScreen from "../screens/app/BillingScreen";
import MatchDetailsScreen from "../screens/app/Match/MatchDetailsScreen";
import Icon from "react-native-vector-icons/Ionicons"; // Or any other icon set you prefer
import { auth, db } from "../firebase";

import { useEffect, useState } from "react";

import { ChatList } from "../services/Chats/api";
import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";
import { off, onValue, ref } from "firebase/database";
import { Modal, Portal } from "react-native-paper";
import { Text, View as Box } from "../Themed";
import { Button } from "galio-framework";
import { GeneralGet } from "../apis/Get/General";
import Colors from "../Colors";
import { navigate } from "./navigationRef";

const Tab = createBottomTabNavigator();

const DummyScreen = () => null; // This won't be rendered.

function HomeNavigation() {
  const [visible, setVisible] = useState(true);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
    gap: 10,
  };

  const [chatList, setChatList, currentUser] = useStore(
    useShallow((state) => [
      state.chatList,
      state.setChatList,
      state.currentUser,
    ])
  );
  const GetChatList = async () => {
    const { result } = await ChatList({ token: auth?.currentUser?.uid });

    setChatList(result);
  };

  const IsProfileComplete = async () => {
    if (currentUser !== null) {
      const { result } = await GeneralGet(
        "profile/iscomplete",
        auth?.currentUser?.uid
      );

      setVisible(result);
    }
  };
  useEffect(() => {
    const handleChatValue = (chatId) => {
      const chatRef = ref(db, `dms/${chatId}/chats`);
      const chatListener = onValue(chatRef, (snapshot) => {
        GetChatList();
      });

      // Return a cleanup function to remove the listener when component unmounts or chatId changes
      return () => {
        off(chatRef, "value", chatListener);
      };
    };

    const dmsRef = ref(db, "dms/");
    const dmsListener = onValue(
      dmsRef,
      (snapshot) => {
        const dms = snapshot.val();

        // Check each group for the user
        for (const chatId in dms) {
          const chat = dms[chatId];
          if (chat.members && chat.members[auth?.currentUser?.uid]) {
            handleChatValue(chatId);
          }
        }
      },
      (error) => {
        console.error("Error getting data:", error);
      }
    );

    // Return a cleanup function to remove the dms listener when component unmounts
    return () => {
      off(dmsRef, "value", dmsListener);
    };
  }, [currentUser, db]);
  const GoToEditProfile = () => {
    setVisible(true);
    navigate({ name: "Edit Profile" });
  };

  useEffect(() => {
    IsProfileComplete();
  }, [currentUser]);
  // if (currentUser == null) {
  //   return (
  //     <Box style={{ flex: 1 }}>
  //       <ActivityIndicator color={Colors.light.acccent} />
  //     </Box>
  //   );
  // }
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
        <Tab.Screen name="Discovery" component={DiscoveryScreen} />
        <Tab.Screen name="Matches" component={MatchesScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
      </Tab.Navigator>
      <Portal>
        <Modal
          visible={visible == false}
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
    </>
  );
}

export default HomeNavigation;
