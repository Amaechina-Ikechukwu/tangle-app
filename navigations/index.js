// navigators/index.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Platform, Text, View } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

// Navigations
import HomeNavigation from "./HomeNavigation";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import RegistrationScreen from "../screens/auth/RegistrationScreen";
import OnboardingScreen from "../screens/auth/OnBoardingScreen";
import BillingScreen from "../screens/app/Account/BillingScreen";
import MatchDetails from "../screens/app/Match/MatchDetailsScreen";
import MessageDetails from "../screens/app/Chats/MessageDetails";
import DiscoveryInterest from "../screens/app/Discovery/DiscoveryInterest";
import ProfileDetailsScreen from "../screens/app/Profile/ViewProfile/ProfileDetailsScreen";
import ManageAccountScreen from "../screens/app/Account/ManageAccountScreen";
import EditProfileScreen from "../screens/app/Account/EditProfileScreen";
import LocationScreen from "../screens/app/Account/LocationScreen";
import Signup from "../screens/auth/Signup";
import { Modal, Portal } from "react-native-paper";
import SelectLocationScreen from "../screens/app/Account/SelectLocationScreen";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";
import { GetMatches } from "../services/Matches/api";
import { GetProfile, UpdateLocation } from "../services/Profile/api";
import EditProfile from "../screens/app/Profile/EditProfile/EditProfile";
import { useNotification } from "../context/Notifications";
import { ActivityIndicator, AppState } from "react-native";
import Colors from "../Colors";
import * as Location from "expo-location";
import { GetLocalData, SetLocalData } from "../services/Storage";
import { GetPosts } from "../services/Posts/api";
import ViewImageScreen from "../screens/app/ViewImageScreen";
import CommentScreen from "../screens/app/Post/CommentScreen";
import { GetStories, GetStoryList } from "../services/Stories/api";
import CreateStoriesScreen from "../screens/app/Post/CreateStoriesScreen";
import { ChatList } from "../services/Chats/api";
import { ref, update } from "firebase/database";
import SearchFriendsScreen from "../screens/app/Discovery/SearchFriendScreen";
import InterestUsers from "../screens/app/Discovery/InterestUsers";
import { GetNotifications } from "../services/Notifications/api";
import NotificationsHome from "../screens/app/Notifications/NotificationsHome";
import { Button } from "galio-framework";
import { GeneralGet } from "../apis/Get/General";
import FeedBackAndSuggestion from "../components/Settings/FeedbackAndSuggestion";
import AccountActions from "../components/Settings/AccountActions";
import ChangeEmail from "../components/Settings/ChangeEmail";
import NotificationsComponent from "../components/Settings/Notifications";
import RequestAccountDeletion from "../components/Settings/RequestAccountDeletion";
import ChangePassword from "../components/Settings/ChangePassword";
import PrivacySettings from "../components/Settings/PrivacySettings";
import ViewBlockedUsers from "../components/Settings/ViewBlockedUsers";
import VerifyEmail from "../components/Settings/VerifyEmail";
import CreatePost from "../components/Home/CreatePost";
import Payments from "../components/Settings/Payments";
import ListOfUsersForAnAction from "../components/feature/ListOfUsersForAnAction";
function MainNavigator() {
  const { showNotification } = useNotification();
  const [route, setRoute] = useState(null);
  const [
    matches,
    setMatches,
    setCurrentUser,
    setPosts,
    setStoryList,
    setStories,
    setChatList,
    setTotalUnread,
    setLocation,
    setNotifications,
    setisprofilecomplete,
    setSettings,
    setIsEmailVerified,
    currentUser,
  ] = useStore(
    useShallow((state) => [
      state.matches,
      state.setMatches,
      state.setCurrentUser,
      state.setPosts,
      state.setStoryList,
      state.setStories,
      state.setChatList,
      state.setTotalUnread,
      state.setLocation,
      state.setNotifications,
      state.setisprofilecomplete,
      state.setSettings,
      state.setIsEmailVerified,
      state.currentUser,
    ])
  );
  const [visible, setVisible] = useState(true);
  const navigation = useNavigation();
  const initializeApp = async () => {
    const user = await GetLocalData({ key: "user" });
    setCurrentUser(user);
    const { loggedIn } = await GetLocalData({ key: "loggedIn" });
    const posts = await GetLocalData({ key: "posts" });
    const storylist = await GetLocalData({ key: "storylist" });
    const stories = await GetLocalData({ key: "stories" });
    const location = await GetLocalData({ key: "location" });
    const settings = await GetLocalData({ key: "settings" });

    setStoryList(storylist);
    setStories(stories);
    setPosts(posts);
    setLocation(location);
    for (const key in settings) {
      setSettings(key, settings[key]);
    }

    if (loggedIn) {
      setRoute("Home Navigation");
      navigation.navigate("Home Navigation");
    } else {
      setRoute("Login");
      navigation.navigate("Login");
    }
  };

  const UpdatePresence = async ({ status }) => {
    if (auth?.currentUser.uid) {
      update(ref(db, "users/" + auth?.currentUser.uid), {
        status,
      });
    }
  };
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
    gap: 10,
  };
  const GoToEditProfile = () => {
    setVisible(true);
    navigate({ name: "Edit Profile" });
  };

  const IsProfileComplete = async () => {
    if (route !== "Login") {
      if (
        auth?.currentUser?.uid !== null ||
        auth?.currentUser?.uid !== undefined
      ) {
        const { result } = await GeneralGet(
          "profile/iscomplete",
          auth?.currentUser?.uid
        );

        setisprofilecomplete(result);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user !== null) {
        IsProfileComplete();
        SetLocalData({ key: "loggedIn", value: { loggedIn: true } });
        initializeApp();

        const [
          profileResponse,
          postsResponse,
          storyListResponse,
          storiesResponse,
          matchesResponse,
          chatlistResponse,
          notificationsResponse,
        ] = await Promise.all([
          GetProfile({ token: user.uid, body: { user: user.uid } }),
          GetPosts({ token: user?.uid }),
          GetStoryList({ token: user?.uid }),
          GetStories({ token: user?.uid }),
          GetMatches({ token: user.uid }),
          ChatList({ token: auth?.currentUser?.uid }),
          GetNotifications({ token: user?.uid }),
        ]);

        const { result: profile } = profileResponse;
        const posts = postsResponse;
        const story = storyListResponse;
        const stories = storiesResponse;
        const { result } = matchesResponse;
        const { result: chatlist, unread } = chatlistResponse;
        const { result: notifications } = notificationsResponse;
        setCurrentUser(profile);

        setStoryList(story);
        setPosts(posts);
        setStories(stories);
        setNotifications(notifications);
        setMatches(result);
        setChatList(chatlist);
        setTotalUnread(unread);
        setIsEmailVerified(user?.emailVerified);
        SetLocalData({ key: "user", value: profile });
        SetLocalData({ key: "posts", value: posts.slice(0, 10) });
        SetLocalData({ key: "storylist", value: story?.slice(0, 10) });
        SetLocalData({ key: "stories", value: stories });
      } else {
        SetLocalData({ key: "loggedIn", value: { loggedIn: false } });
        setRoute("Login");
        setisprofilecomplete(true);
        navigation.navigate("Login");
      }
    });
    return unsubscribe; // Clean up the subscription on unmount
  }, [auth]); // Include navigation as a dependency since it's used in the effect

  useEffect(() => {
    if (auth) {
      const unsubscribe = navigation.addListener("focus", () => {
        // Do something when the screen comes into focus
        setIsEmailVerified(user?.emailVerified);
      });
      return unsubscribe;
    }
    // Cleanup function to unsubscribe the listener when the component is unmounted
  }, [navigation, auth]);

  useEffect(() => {
    if (currentUser !== null) {
      // Start watching for location updates
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        await Location.getCurrentPositionAsync(
          {
            enableHighAccuracy: true, // Request high accuracy if needed
            timeout: 5000, // Update interval in milliseconds (optional)
            maximumAge: 1000, // Don't use cached location older than 1 second (optional)
          },
          async (location) => {
            const { latitude, longitude } = location.coords;
            const url = `http://api.geonames.org/findNearbyJSON?lat=${latitude}&lng=${longitude}&username=ikaychina`;

            fetch(url)
              .then((response) => response.json())
              .then(async (data) => {
                const { geonames } = data;

                if (geonames.length > 0) {
                  const newData = { ...location, ...geonames[0] };
                  SetLocalData({
                    key: "location",
                    value: { newData },
                  });
                  setLocation(newData);
                  setSettings("location", newData);
                  await UpdateLocation({
                    token: auth?.currentUser?.uid,
                    body: { location: newData },
                  });
                } else {
                  showNotification("Cannot get your location at the moment");
                }
              })
              .catch((error) => {});
          }
        );
      })();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser !== null) {
      const handleAppStateChange = (nextAppState) => {
        if (nextAppState === "active") {
          // App is in foreground
          UpdatePresence({ status: "online" });
        } else {
          // App is in background
          UpdatePresence({ status: "offline" });
        }
      };

      AppState.addEventListener("change", handleAppStateChange);

      return () => {};
    }
  }, [auth, currentUser]);
  try {
    return (
      <>
        <Stack.Navigator>
          <Stack.Screen
            name="Home Navigation"
            component={HomeNavigation}
            options={{
              headerLeft: () => null, // this hides the back button
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerLeft: () => null, // this hides the back button
              headerShown: false,
              title: null,
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignupScreen}
            options={{ title: null, headerShown: false }}
          />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Billing" component={BillingScreen} />
          <Stack.Screen
            name="Create Post"
            component={CreatePost}
            options={{ title: null, headerShown: false }}
          />
          <Stack.Screen
            name="MatchDetails"
            component={MatchDetails}
            options={{ title: null, headerShown: false }}
          />
          <Stack.Screen
            name="MessageDetails"
            component={MessageDetails}
            options={{ title: null, headerShown: false }}
          />
          <Stack.Screen
            name="DiscoveryInterest"
            component={DiscoveryInterest}
            options={{ title: null, headerShown: false }}
          />
          <Stack.Screen
            name="InterestUsers"
            component={InterestUsers}
            options={{ title: null, headerShown: false }}
          />
          <Stack.Screen
            name="ProfileDetailsScreen"
            component={ProfileDetailsScreen}
            options={{ title: null, headerShown: false }}
          />
          <Stack.Screen
            name="Edit Profile"
            component={EditProfile}
            options={{
              headerLeft: () => null, // this hides the back button
              headerShown: false,
              title: null,
            }}
          />
          <Stack.Screen name="Location Setting" component={LocationScreen} />
          <Stack.Screen name="Manage Account" component={ManageAccountScreen} />
          <Stack.Screen
            name="Feedback and Suggestion"
            component={FeedBackAndSuggestion}
          />
          <Stack.Screen name="Account Actions" component={AccountActions} />
          <Stack.Screen name="Privacy Settings" component={PrivacySettings} />
          <Stack.Screen
            name="Request Account Deletion"
            component={RequestAccountDeletion}
          />
          <Stack.Screen name="Blocked Users" component={ViewBlockedUsers} />
          <Stack.Screen name="Email Verification" component={VerifyEmail} />
          <Stack.Screen name="Push Token" component={NotificationsComponent} />

          <Stack.Screen name="Change Password" component={ChangePassword} />
          <Stack.Screen name="Change Email" component={ChangeEmail} />
          <Stack.Screen
            name="Select Location"
            component={SelectLocationScreen}
          />
          <Stack.Screen name="Payments" component={Payments} />
          <Stack.Screen name="View Image" component={ViewImageScreen} />
          <Stack.Screen
            name="Comments"
            component={CommentScreen}
            options={{
              headerLeft: () => null, // this hides the back button
              headerShown: false,
              title: null,
            }}
          />
          <Stack.Screen
            name="List Of Users On Action"
            component={ListOfUsersForAnAction}
            options={({ route }) => ({
              title: route.params?.headerTitle || "Home",
            })}
          />
          <Stack.Screen
            name="Create Story"
            component={CreateStoriesScreen}
            options={{
              headerLeft: () => null, // this hides the back button
              headerShown: false,
              title: null,
            }}
          />
          <Stack.Screen
            name="Search"
            component={SearchFriendsScreen}
            options={{
              headerLeft: () => null, // this hides the back button
              headerShown: false,
              title: null,
            }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsHome}
            options={{
              headerLeft: () => null, // this hides the back button
              headerShown: false,
              title: null,
            }}
          />
        </Stack.Navigator>
      </>
    );
  } catch (error) {
    return (
      <View>
        <Text>{JSON.parse(error)}</Text>
      </View>
    );
  }
}

export default MainNavigator;
