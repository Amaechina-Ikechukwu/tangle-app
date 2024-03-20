import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import {
  Avatar,
  TextInput,
  Button,
  IconButton,
  Tabs,
  Chip,
  Menu,
  Provider as PaperProvider,
} from "react-native-paper";
import { PaperSelect } from "react-native-paper-select";

import * as ImagePicker from "expo-image-picker";
const EditProfileScreen = () => {
  const [index, setIndex] = useState(0);
  const [userInfo, setUserInfo] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const [routes] = useState([
    { key: "bio", title: "Bio" },
    { key: "photos", title: "Photos" },
  ]);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState(1);
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Initialize genderList as an array of values, not an object with list and selectedList
  const [genderList, setGenderList] = useState([
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ]);

  const [selectedGender, setSelectedGender] = useState("");
  const openMenu = () => setShowMenu(true);
  const closeMenu = () => setShowMenu(false);

  // Replace with your image picker handler
  const handlePickImage = () => console.log("Image picker triggered");

  // useEffect to set user info from the redux state
  useEffect(() => {
    if (userData) {
      setUsername(userData.username || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setAge(userData.age || 1);
      setGender(userData.gender || "");
      setBio(userData.bio || "");
    }
  }, [userData]); // Depend on userData

  const handleGenderSelection = (value) => {
    setSelectedGender(value); // Update the selectedGender state
  };

  const updateProfile = () => {
    setIsLoading(true);
    const updatedInfo = {
      username,
      email,
      phone,
      age,
      gender: selectedGender, // use selectedGender instead of gender
      bio,
    };
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={80}
            label="JD"
            source={image ? { uri: image } : null}
            style={styles.avatar}
          />
          <IconButton
            icon="camera"
            size={20}
            style={styles.cameraIcon}
            onPress={pickImage}
          />
        </View>
        {/* <Text>{JSON.stringify( userData)}</Text> */}
        <TextInput
          label="Username"
          value={username}
          mode="outlined"
          outlineStyle={{ borderColor: "#ececec" }}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          label="Email"
          value={email}
          outlineStyle={{ borderColor: "#ececec" }}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Phone"
          value={phone}
          outlineStyle={{ borderColor: "#ececec" }}
          onChangeText={setPhone}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Age"
          value={age}
          outlineStyle={{ borderColor: "#ececec" }}
          onChangeText={setAge}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />

        <PaperSelect
          label="Select Gender"
          value={gender} // Use selectedGender as the value
          onSelection={(selectedItem) =>
            handleGenderSelection(selectedItem.value)
          }
          arrayList={genderList} // Use genderList as the list of options
          selectedArrayList={[selectedGender]} // Pass an array with the selected value
          dialogTitleStyle={{ color: "red" }}
          checkboxColor="yellow"
          checkboxLabelStyle={{ color: "red", fontWeight: "700" }}
          textInputBackgroundColor="yellow"
          textInputColor="red"
          outlineColor="black"
          theme={{ colors: { placeholder: "black" } }}
        />

        <TextInput
          label="bio"
          value={bio}
          mode="outlined"
          multiline
          outlineStyle={{ borderColor: "#ececec" }}
          numberOfLines={5}
          onChangeText={setBio}
          style={styles.input}
        />
        <Button onPress={updateProfile} mode="contained" style={styles.button}>
          <Text> Save Profile </Text>
        </Button>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  avatarContainer: {
    alignItems: "center",
    position: "relative",
    marginTop: 20,
    marginBottom: 40,
  },
  avatar: {
    backgroundColor: "#dedede",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: "25%",
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 2,
  },
  input: {
    marginBottom: 1,
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  button: {
    marginTop: 10,
  },

  menuContainer: {
    flexDirection: "row",
  },

  menuButton: {
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: 0,
  },
});

export default EditProfileScreen;
