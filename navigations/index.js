// navigators/index.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
import SelectLocationScreen from "../screens/app/Account/SelectLocationScreen";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";
import { GetMatches } from "../services/Matches/api";
import { GetProfile } from "../services/Profile/api";
import EditProfile from "../screens/app/Profile/EditProfile/EditProfile";
import { useNotification } from "../context/Notifications";
import { ActivityIndicator } from "react-native";
import Colors from "../Colors";
import { View } from "../Themed";
import { GetLocalData, SetLocalData } from "../services/Storage";
import { GetPosts } from "../services/Posts/api";
import ViewImageScreen from "../screens/app/ViewImageScreen";
import CommentScreen from "../screens/app/Post/CommentScreen";
import { GetStories, GetStoryList } from "../services/Stories/api";
import CreateStoriesScreen from "../screens/app/Post/CreateStoriesScreen";
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
  ] = useStore(
    useShallow((state) => [
      state.matches,
      state.setMatches,
      state.setCurrentUser,
      state.setPosts,
      state.setStoryList,
      state.setStories,
    ])
  );
  const navigation = useNavigation();
  const initializeApp = async () => {
    const user = await GetLocalData({ key: "user" });
    setCurrentUser(user);
    const { loggedIn } = await GetLocalData({ key: "loggedIn" });
    const posts = await GetLocalData({ key: "posts" });
    const storylist = await GetLocalData({ key: "storylist" });
    const stories = await GetLocalData({ key: "stories" });
    setStoryList(storylist);
    setStories(stories);
    setPosts(posts);
    if (loggedIn) {
      setRoute("Home Navigation");
      navigation.navigate("Home Navigation");
    } else {
      setRoute("Login");
      navigation.navigate("Login");
    }
  };
  useEffect(() => {
    initializeApp();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user !== null) {
        SetLocalData({ key: "loggedIn", value: { loggedIn: true } });
        initializeApp();

        const profile = await GetProfile({
          token: user.uid,
          body: { user: user.uid },
        });

        const posts = await GetPosts({ token: user?.uid });
        const story = await GetStoryList({ token: user?.uid });
        const stories = await GetStories({ token: user?.uid });

        const { result } = await GetMatches({ token: user.uid });

        setCurrentUser(profile.result);

        setStoryList(story);
        setPosts(posts);
        setStories(stories);
        setMatches(result);
        SetLocalData({ key: "user", value: profile.result });
        SetLocalData({ key: "posts", value: posts.slice(0, 10) });
        SetLocalData({ key: "storylist", value: story?.slice(0, 10) });
        SetLocalData({ key: "stories", value: stories });
      } else {
        SetLocalData({ key: "loggedIn", value: { loggedIn: false } });
        setRoute("Login");
        navigation.navigate("Login");
      }
    });

    return unsubscribe; // Clean up the subscription on unmount
  }, []); // Include navigation as a dependency since it's used in the effect

  useEffect(() => {}, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home Navigation"
        component={HomeNavigation}
        options={{
          headerLeft: () => null, // this hides the back button
          headerShown: false,
        }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Billing" component={BillingScreen} />
      <Stack.Screen
        name="MatchDetails"
        component={MatchDetails}
        options={{ title: null }}
      />
      <Stack.Screen
        name="MessageDetails"
        component={MessageDetails}
        options={{ title: null }}
      />
      <Stack.Screen name="DiscoveryInterest" component={DiscoveryInterest} />
      <Stack.Screen
        name="ProfileDetailsScreen"
        component={ProfileDetailsScreen}
        options={{ title: null }}
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
      <Stack.Screen name="Select Location" component={SelectLocationScreen} />
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
        name="Create Story"
        component={CreateStoriesScreen}
        options={{
          headerLeft: () => null, // this hides the back button
          headerShown: false,
          title: null,
        }}
      />
    </Stack.Navigator>
  );
}

export default MainNavigator;
