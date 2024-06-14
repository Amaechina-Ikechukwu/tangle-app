import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNotification } from "../../../../../context/Notifications";
import { storage } from "../../../../../firebase";
const Step8 = ({ nextStep, images, setImages, prevStep, step, image }) => {
  const [selectedImage, setSelectedImage] = useState(image);
  const [imageurl, setimageurl] = useState(null);
  const { showNotification } = useNotification();
  useEffect(() => {
    setSelectedImage(image); // Clear the selected image when navigating back to this step
  }, [step]);
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
        try {
          const number = Math.random();
          const blob = await uriToBlob(selectedAsset.uri);
          const path = `images/${number}/random-profile/${blob._data.name}`;
          const imageRef = ref(storage, path);
          showNotification("Please wait, uploading image");
          await uploadBytes(imageRef, blob);

          // Get the download URL of the uploaded file
          const downloadURL = await getDownloadURL(imageRef);
          setImages(downloadURL);
          setimageurl(downloadURL);
          setSelectedImage(downloadURL);
          showNotification("Uploaded, Press 'Update' to continue");
          handleImageUpload();
          return downloadURL; // Return the download URL
        } catch (error) {
          throw new Error(error);
          // Return null to indicate an error
        }
        // setImages([...images, selectedAsset.uri]); // Save the selected image to the array
      }
    }
  };

  const handleImageUpload = async () => {
    // Your image upload logic here
    // Make sure to replace this with your actual API call

    // After successfully uploading the images, you can proceed to the next step
    if (imageurl) {
      nextStep();
    } else {
    }
  };

  // Calculate progress
  const totalSteps = 9; // Total number of steps
  const progress = (step / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Image</Text>
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Upload Your Image</Text>
        </View>
      )}
      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.imagePickerButtonText}>Select an Image</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorinzontal: 20,
    marginBottom: 7,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  imagePickerButton: {
    backgroundColor: "#FF355E",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  imagePickerButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginVertical: 20,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    bottom: 20,
  },
  iconButton: {
    backgroundColor: "#FF355E",
    borderRadius: 50,
    padding: 15,
  },
  uploadButton: {
    backgroundColor: "#FF355E",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  stepIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  stepIndicator: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#FF355E",
    borderWidth: 2,
    marginRight: 10,
  },
  filledStepIndicator: {
    backgroundColor: "#FF355E",
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FF355E",
    padding: 15,
    marginBottom: 10,
    width: "100%",
    minHeight: 100, // Adjust the minimum height for the input field
  },
  backButton: {
    position: "absolute",
    left: 20,
    bottom: 20,
    backgroundColor: "#FF355E",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  nextButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#FF355E",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  inputImage: {
    width: 250, // Set appropriate width
    height: 250, // Set appropriate height
    marginBottom: 20, // Adjust as needed
  },

  progressBarContainer: {
    height: 3,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FF355E",
    borderRadius: 5,
  },

  bottomContainer: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    alignItems: "center",
  },
});

export default Step8;
