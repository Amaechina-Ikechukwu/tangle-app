import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import CustomNavbar from "../../../components/CustomNavbar";
import MakeFriendsScreen from "./MakeFriendsScreen";
import SearchFriendsScreen from "../Discovery/SearchFriendScreen";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { useStore } from "../../../store/store";
import { useShallow } from "zustand/react/shallow";

// Define the stories array

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("make");
  const [chatList, setChatList, setCurrentUser] = useStore(
    useShallow((state) => [
      state.chatList,
      state.setChatList,
      state.setCurrentUser,
    ])
  );

  return <MakeFriendsScreen />;
};

export default HomePage;
