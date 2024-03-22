import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

export default function UserHeader({ item, scale, textColor }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
      }}
    >
      <View>
        <Image
          source={{ uri: item.userData.imageurl }}
          style={[
            styles.avatar,
            {
              transform: [{ scale: scale || 0.8 }],
            },
          ]}
        />
      </View>
      <View style={{ gap: 3 }}>
        <Text
          style={[
            styles.profileName,
            { fontSize: 14, color: textColor || "black" },
          ]}
        >
          {item.userData.fullName}, {item.userData.age}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  // Post Styles

  postIconContainer: {
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // Makes the avatar circular
    marginRight: 10, // Spacing between avatar and name
  },
});
