import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

export default function StoryView({ views }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      <FontAwesome name="eye" size={24} color="white" />
      <Text style={{ color: "white" }}>{views}</Text>
    </View>
  );
}
