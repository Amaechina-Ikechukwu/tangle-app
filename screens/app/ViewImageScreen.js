import React from "react";
import { View } from "../../Themed";
import { Image, Text } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function ViewImageScreen() {
  const route = useRoute();
  const { image } = route.params;
  return (
    <View>
      <Image
        source={{ uri: image }}
        resizeMode="contain"
        style={{ height: "100%", width: "100%" }}
      />
    </View>
  );
}
