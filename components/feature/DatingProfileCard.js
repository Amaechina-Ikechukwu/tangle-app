import React, { useEffect } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Remember to install @expo/vector-icons
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../Themed";
import LikeComponent from "../Post/LikeComponent";

const DatingProfileCard = ({ item, navigation, from }) => {
  const enlargeImage = () => {
    navigation.navigate({
      name: "View Image",
      params: { image: item.imageurl },
    });
  };
  const goToComments = () => {
    navigation.navigate({
      name: "Comments",
      params: { item: item },
    });
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={enlargeImage}>
        {item?.imageurl.length > 0 && (
          <Image
            source={{ uri: item.imageurl }}
            resizeMode="cover"
            style={styles.profileImage}
          />
        )}

        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0, 0, 0,0.7)"]}
          style={styles.gradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 0, y: 1 }}
        />
      </TouchableOpacity>
      <View style={styles.interestTag}>
        <Text inverse={true} style={{ fontWeight: 600 }}>
          {item?.type && item.type}
        </Text>
      </View>

      <View style={styles.iconContainer}>
        <LikeComponent postid={item.postid} liked={item.liked} />
        {from !== "comments" && (
          <TouchableOpacity onPress={goToComments} style={styles.iconWrapper}>
            <FontAwesome name="comment" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.overlayContent}>
        <Text style={styles.profileName}>{item.caption}</Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <Image
            source={{ uri: item.userData.imageurl }}
            style={[
              styles.avatar,
              {
                transform: [{ scale: 0.8 }],
              },
            ]}
          />
          <Text style={[styles.profileName, { fontSize: 14 }]}>
            {item.userData.fullName}, {item.userData.age}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  profileImage: {
    width: "100%",
    aspectRatio: 1 / 1,
  },
  interestTag: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    backgroundColor: "rgba(128, 128, 128, 0.7)", // semi-transparent grey
    padding: 5,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 15,
    alignItems: "center",
  },
  interestTagText: {
    color: "#FFFFFF",
    marginLeft: 5,
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -50 }], // adjust to center based on icons' size and spacing
  },
  iconWrapper: {
    backgroundColor: "rgba(128, 128, 128, 0.7)", // semi-transparent grey
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  overlayContent: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    padding: 10,
    borderRadius: 5,
    gap: 5,
  },
  profileName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    color: "#FFFFFF",
    marginTop: 5,
  },

  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  infoContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center", // To align the avatar and the name vertically
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // Makes the avatar circular
    marginRight: 10, // Spacing between avatar and name
  },
});

export default DatingProfileCard;
