import { View, Text } from "react-native";
import React from "react";
import CreateStory from "../../../components/Home/CreateStory";
import { useRoute } from "@react-navigation/native";

export default function CreateStoriesScreen() {
  const route = useRoute();
  const { image, height } = route?.params;
  return <CreateStory image={image} height={height} />;
}
