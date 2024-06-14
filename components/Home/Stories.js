import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";
import { FontAwesome } from "@expo/vector-icons";
import { firstName } from "../../utils/SplitName";
import StoryModal from "./StoryModal";
import { auth } from "../../firebase";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { GeneralGet } from "../../apis/Get/General";
import { useNotification } from "../../context/Notifications";
const StoryItem = ({ story, onClick }) => {
  if (story) {
    return (
      <View>
        <TouchableOpacity onPress={() => onClick(story)} style={styles.story}>
          <Image
            source={{ uri: story.imageurl }}
            style={[
              styles.storyImage,
              { borderColor: story.seen ? "gray" : "red" },
            ]}
          />
          <Text style={styles.storyUser}>
            {firstName({ fullname: story.fullName })}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};
const Header = ({ currentUser, storyLength }) => {
  const { showNotification } = useNotification();

  const navigation = useNavigation();
  const pickImage = async () => {
    if (storyLength !== null) {
      if (storyLength >= 3 && !currentUser?.subscribed) {
        showNotification("Become a premium user to post more stories");
        return;
      }
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert(
          "Permission Denied",
          "Sorry, we need camera roll permission to upload images."
        );
      } else {
        const result = await ImagePicker.launchImageLibraryAsync();

        if (!result.cancelled) {
          const selectedAsset = result.assets[0]; // Access the selected asset from
          navigation.navigate({
            name: "Create Story",
            params: { image: selectedAsset.uri, height: selectedAsset.height },
          });
        }
      }
    }
  };
  return (
    <View>
      <TouchableOpacity onPress={pickImage}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={{ uri: currentUser.imageurl }}
            style={[styles.storyImage, { borderColor: "gray" }]}
          />
          <Text style={{ fontSize: 14, color: "gray" }}>Add Story</Text>
        </View>
        <View style={{ position: "absolute", bottom: 20, right: 0 }}>
          <FontAwesome name="plus" size={18} color="gray" />
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default function Stories() {
  const [storyList, currentUser, setStoryLength, storyLength] = useStore(
    useShallow((state) => [
      state.storyList,
      state.currentUser,
      state.setStoryLength,
      state.storyLength,
    ])
  );
  const [story, setStory] = useState();
  const openStory = (story) => {
    if (story) {
      setStory(story);
      setOpenModal(!openModal);
    }
  };
  const closeModal = () => {
    setStory();
    setOpenModal(!openModal);
  };
  const checkLengthOfStoryPosted = async () => {
    const { result } = await GeneralGet(
      "stories/storieslength",
      currentUser?.userKey
    );

    setStoryLength(result);
  };
  useEffect(() => {
    checkLengthOfStoryPosted();
  }, [storyList]);
  const [openModal, setOpenModal] = useState(false);
  return (
    <View>
      <View style={styles.storiesContainer}>
        {currentUser && (
          <Header currentUser={currentUser} storyLength={storyLength} />
        )}
        <FlatList
          data={storyList}
          renderItem={({ item }) => (
            <StoryItem story={item} onClick={(story) => openStory(story)} />
          )}
          horizontal
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      {story && (
        <StoryModal open={openModal} close={() => closeModal()} data={story} />
      )}
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
    gap: 20,
    padding: 10,
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
