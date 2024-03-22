import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";

import { useNavigation } from "@react-navigation/native";
import Colors from "../../Colors";
import { auth, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNotification } from "../../context/Notifications";
import { GetPosts } from "../../services/Posts/api";
import { GeneralPost } from "../../apis/Post/General";
import { GetStories } from "../../services/Stories/api";
const styles = StyleSheet.create({
  // Post Styles

  imageContainer: {
    position: "relative",
  },
  postImage: {},
  postInput: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingLeft: 10,
    justifyContent: "center",
    backgroundColor: "gray",
    alignItems: "center",
    color: "white",
  },
  postInputText: {
    fontSize: 16,
    color: "white",
  },

  postSection: {
    padding: 15,
    backgroundColor: "black",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    flex: 1,
    gap: 20,
    justifyContent: "center",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postIconContainer: {
    marginLeft: 10,
  },
});
export default function CreateStory({ image, height }) {
  const selectedImage = image;
  const [currentUser, setStories] = useStore(
    useShallow((state) => [state.currentUser, state.setStories])
  );

  const [ready, setReady] = useState(false);
  const [postContent, setPostContent] = useState(""); // State to manage the post content
  const navigation = useNavigation();
  const { showNotification } = useNotification();

  function uriToBlob(uri) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send();
    });
  }

  const handleImageUpload = async () => {
    try {
      showNotification("Uploading...");
      const blob = await uriToBlob(selectedImage);
      const path = `stories/${auth?.currentUser?.uid}/${blob._data.name}`;
      const imageRef = ref(storage, path);
      showNotification("Please wait...");
      await uploadBytes(imageRef, blob);

      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(imageRef);

      showNotification("Posting...");
      const body = {
        caption: postContent,
        imageurl: downloadURL,
        location: "",
      };
      const result = await GeneralPost(
        "stories/createstory",
        auth?.currentUser?.uid,
        body
      );
      showNotification(result + " ");
      const posts = await GetStories({ token: auth?.currentUser?.uid });
      setPostContent("");
      setStories(posts);
      navigation.goBack();
      return result; // Return the download URL
    } catch (error) {
      console.log(error);
      throw new Error(error);
      // Return null to indicate an error
    }
  };
  useEffect(() => {
    if (selectedImage && postContent.length > 5) {
      setReady(true);
    } else {
      setReady(false);
    }
  }, [selectedImage, postContent]);

  return (
    <View style={styles.postSection}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: currentUser?.imageurl }}
          style={styles.profilePic}
        />
        <Text style={{ color: "white" }}>{currentUser?.fullName}</Text>
      </View>

      <Image
        source={{ uri: selectedImage }}
        resizeMode="contain"
        style={{ height: "70%", width: "100%" }}
      />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          flexDirection: "row",
          margin: 10,
          alignItems: "center",
        }}
      >
        <TextInput
          style={styles.postInput}
          value={postContent}
          onChangeText={(text) => setPostContent(text)}
          placeholder="What's on your mind?"
          maxLength={200}
          cursorColor={Colors.light.acccent}
        />

        <TouchableOpacity
          disabled={ready == false}
          onPress={handleImageUpload}
          style={styles.postIconContainer}
        >
          <Icon
            name="paper-plane"
            size={24}
            color={ready == false ? "gray" : Colors.light.acccent}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
