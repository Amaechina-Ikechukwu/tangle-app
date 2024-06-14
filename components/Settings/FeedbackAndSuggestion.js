import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Button,
  Platform,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { CustomButton, CustomTextInput } from "../../Themed";
import * as ImagePicker from "expo-image-picker";
import { useNotification } from "../../context/Notifications";
import Colors from "../../Colors";
import { Checkbox } from "react-native-paper";
import { navigate } from "../../navigations/navigationRef";
import { auth, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { GeneralPost } from "../../apis/Post/General";
import { useNavigation } from "@react-navigation/native";
const { height, width } = Dimensions.get("screen");
export default function FeedBackAndSuggestion() {
  const { showNotification } = useNotification();
  const navigation = useNavigation();
  const [type, setType] = useState("");
  const [image, setImage] = useState();
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
  });
  const [disabled, setDisable] = useState(false);
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
        const selectedAsset = result.assets[0]; // Access the selected asset from
        setImage(selectedAsset.uri);
      }
    }
  };
  const enlargeImage = () => {
    navigate({
      name: "View Image",
      params: { image: image },
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

  const handleImageUpload = async () => {
    try {
      let downloadURL = "";
      if (image) {
        showNotification("Uploading...");
        const blob = await uriToBlob(image);
        const path = `feedbackandsuggestion/${auth?.currentUser?.uid}/${blob._data.name}`;
        const imageRef = ref(storage, path);
        showNotification("Please wait...");
        await uploadBytes(imageRef, blob);

        // Get the download URL of the uploaded file
        downloadURL = await getDownloadURL(imageRef);
      }

      showNotification(`Sending ${type} ...`);
      const body = {
        imageurl: downloadURL,
        ...inputs,
        type,
      };

      const result = await GeneralPost(
        "accounts/feedbackandsuggestion",
        auth?.currentUser?.uid,
        body
      );
      showNotification(result + " ");

      navigation.goBack();
      return result; // Return the download URL
    } catch (error) {
      console.log(error);
      throw new Error(error);
      // Return null to indicate an error
    }
  };
  useEffect(() => {
    if (
      type.length === 0 ||
      inputs.title.length === 0 ||
      inputs.description.length === 0
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [type, inputs.title, inputs.description]);

  return (
    <View style={styles.container}>
      <View>
        {image ? (
          <TouchableOpacity onPress={enlargeImage}>
            <Image
              source={{ uri: image }}
              resizeMode="cover"
              style={{ height: height * 0.3, width: width * 0.9 }}
            />
            <Text style={{ color: Colors.light.tint }}>Tap to enlarge</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.addImage}>
              <Text>Add image</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <CustomTextInput
        style={{ width: "100%" }}
        value={inputs.title}
        onChange={(text) => setInputs((input) => ({ ...input, title: text }))}
        placeholder="Title"
      />
      <CustomTextInput
        value={inputs.description}
        onChange={(text) =>
          setInputs((input) => ({ ...input, description: text }))
        }
        style={{ width: "100%", height: 70 }}
        placeholder="Description"
        multiline={true}
      />
      <View style={styles.checkboxView}>
        <Text style={{ fontSize: 18 }}>Type:</Text>

        <View style={styles.innerCheckboxView}>
          <View style={styles.innerCheckboxView}>
            <Checkbox
              color={Colors.light.acccent}
              status={type == "Feedback" ? "checked" : "unchecked"}
              onPress={() => {
                setType("Feedback");
              }}
            />
            <Text>Feedback</Text>
          </View>
          <View style={styles.innerCheckboxView}>
            <Checkbox
              color={Colors.light.acccent}
              status={type == "Suggestion" ? "checked" : "unchecked"}
              onPress={() => {
                setType("Suggestion");
              }}
            />
            <Text>Suggestion</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        disabled={disabled}
        onPress={() => handleImageUpload()}
      >
        <Text style={{ color: "white" }}>Submit {type}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 20,
  },
  checkboxView: {
    width: "100%",
    gap: 10,
    marginTop: 20,
  },
  innerCheckboxView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: Colors.light.acccent,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 10,
  },
  addImage: {
    height: height * 0.3,
    width: width * 0.9,
    backgroundColor: Colors.dark.tint,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});
