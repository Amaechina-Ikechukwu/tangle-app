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
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../Colors";
import { auth, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNotification } from "../../context/Notifications";
import { GetPosts } from "../../services/Posts/api";
import { GeneralPost } from "../../apis/Post/General";
const styles = StyleSheet.create({
  // Post Styles
  post: {
    marginVertical: 15,
    width: "100%",
  },
  postImage: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 10,
    left: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  captionInsideImage: {
    position: "absolute",
    bottom: 50, // Adjust this value based on your footer height
    left: 10,
    color: "white",
    fontSize: 14,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    // textAlign: 'center',
  },
  postFooter: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    left: 10,
    alignItems: "center",
  },
  likeButton: {
    color: "white",
    marginRight: 15, // For spacing between buttons
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },

  imageContainer: {
    position: "relative",
  },
  darkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    opacity: 0.3, // Adjust this value to increase or decrease darkness
  },
  addPostContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  addPostText: {
    fontSize: 16,
    color: "#888",
  },
  postSection: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingLeft: 10,
    justifyContent: "center",
  },
  postInputText: {
    fontSize: 16,
    color: "#888",
  },

  postSection: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postInput: {
    flex: 1,
  },
  postIconContainer: {
    marginLeft: 10,
  },
});
export default function CreatePost() {
  const [currentUser, setPosts] = useStore(
    useShallow((state) => [state.currentUser, state.setPosts])
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [ready, setReady] = useState(false);
  const [postContent, setPostContent] = useState(""); // State to manage the post content
  const navigation = useNavigation();
  const { showNotification } = useNotification();
  const enlargeImage = () => {
    navigation.navigate({
      name: "View Image",
      params: { image: selectedImage },
    });
  };
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
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert(
        "Permission Denied",
        "Sorry, we need camera roll permission to upload images."
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync();

      if (!result.cancelled) {
        const selectedAsset = result.assets[0]; // Access the selected asset from the "assets" array
        setSelectedImage(selectedAsset.uri);

        // setImages([...images, selectedAsset.uri]); // Save the selected image to the array
      }
    }
  };

  const handleImageUpload = async () => {
    try {
      showNotification("Uploading...");
      const blob = await uriToBlob(selectedImage);
      const path = `posts/${auth?.currentUser?.uid}/${blob._data.name}`;
      const imageRef = ref(storage, path);
      showNotification("Please wait, uploading image");
      await uploadBytes(imageRef, blob);

      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(imageRef);

      showNotification("Posting");
      const body = {
        caption: postContent,
        imageurl: downloadURL,
        location: "",
      };
      const result = await GeneralPost(
        "posts/createpost",
        auth?.currentUser?.uid,
        body
      );
      showNotification(result);
      const posts = await GetPosts({ token: auth?.currentUser?.uid });
      setPostContent("");
      setSelectedImage(null);
      setPosts(posts);

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
      <Image
        source={{ uri: currentUser?.imageurl }}
        style={styles.profilePic}
      />
      {selectedImage && (
        <TouchableOpacity
          style={{ height: 50, width: 100 }}
          onPress={() => enlargeImage()}
        >
          <Image
            source={{ uri: selectedImage }}
            resizeMode="contain"
            style={{ height: "100%", width: "100%" }}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.postInput}>
        <TextInput
          cursorColor={Colors.light.acccent}
          style={styles.postInput}
          value={postContent}
          onChangeText={(text) => setPostContent(text)}
          placeholder="What's on your mind?"
          maxLength={500}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImage}>
        <Icon name="image" size={24} color="gray" />
      </TouchableOpacity>
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
  );
}
