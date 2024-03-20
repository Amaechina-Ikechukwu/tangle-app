import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

export default function Statuses() {
  const stories = [
    {
      id: "1",
      user: "Alice",
      image: require("../../assets/images/onboarding/face_1.jpg"),
    },
    {
      id: "2",
      user: "Josh",
      image: require("../../assets/images/onboarding/face_2.jpg"),
    },
    {
      id: "3",
      user: "Ashley",
      image: require("../../assets/images/onboarding/face_3.jpg"),
    },
    {
      id: "4",
      user: "Kim",
      image: require("../../assets/images/onboarding/face_4.jpg"),
    },
    {
      id: "5",
      user: "Jones",
      image: require("../../assets/images/onboarding/face_5.jpeg"),
    },
  ];
  return (
    <View>
      <View style={styles.storiesContainer}>
        {stories.map((story) => (
          <View key={story.id} style={styles.story}>
            <Image source={story.image} style={styles.storyImage} />
            <Text style={styles.storyUser}>{story.user}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  // Stories Styles
  storiesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
    zIndex: -1,
  },
  story: {
    flex: 1,
    alignItems: "center",
    marginRight: 10,
    position: "relative",
  },
  storyImage: {
    width: 60,
    height: 60,
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 30,
    marginBottom: 5,
  },
  userIconInsideStory: {
    position: "absolute",
    bottom: 5,
    left: "50%",
    transform: [{ translateX: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  liveIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 20,
    height: 20,
  },
  storyUser: {
    // fontSize: 12,
  },

  // Navigation Styles (if you requested before)
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
  },
  companyIcon: {
    width: 30,
    height: 30,
  },

  tabsContainer: {
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    // Add a border to the entire container if needed
    borderColor: "#ccc",
    borderRadius: 30,
    backgroundColor: "#fbe7ef", // light grey background
  },
  tab: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25, // Gives rounded corners
    backgroundColor: "transparent", // default tab background
    marginHorizontal: 5, // spacing between tabs
  },
  activeTab: {
    backgroundColor: "#fff", // active tab has distinct color
  },
  tabText: {
    color: "#000", // Dark text color
    fontWeight: "500",
  },

  postsContainer: {
    flex: 1,
    // Add styles for your posts section
  },
});
