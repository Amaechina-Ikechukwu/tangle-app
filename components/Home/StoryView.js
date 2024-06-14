import { Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { auth } from "../../firebase";
import { navigate } from "../../navigations/navigationRef";

export default function StoryView({ views, author, storyid, close }) {
  const isCurrentUserPost = author == auth?.currentUser?.uid;
  const openList = () => {
    if (isCurrentUserPost) {
      // close();
      navigate({
        name: "List Of Users On Action",
        params: {
          name: "List Of Views On Your Story",
          url: `stories/getstoryseenlist?storyid=${storyid}`,
        },
      });
    }
  };
  return (
    <TouchableOpacity onPress={openList}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <FontAwesome name="eye" size={24} color="white" />
        <Text style={{ color: "white" }}>{views}</Text>
      </View>
    </TouchableOpacity>
  );
}
