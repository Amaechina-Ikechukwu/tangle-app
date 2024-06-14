import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Remember to install @expo/vector-icons if you haven't
import { Text } from "galio-framework";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { auth, db, storage } from "../../../firebase";
import { onValue, ref } from "firebase/database";
import { SendMessage } from "../../../services/Chats/api";
import Colors from "../../../Colors";
import MessageParts from "../../../components/Chats/MessageParts";
import { Audio } from "expo-av";
import { useNotification } from "../../../context/Notifications";
import InputArea from "../../../components/Chats/InputArea";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref as refff, uploadBytes } from "firebase/storage";
import { useStore } from "../../../store/store";
import { useShallow } from "zustand/react/shallow";
import ChatHeader from "../../../components/Chats/ChatHeader";
import SubscriptionSuggestion from "../../../components/feature/SubscriptionSuggestion";
const HeaderComponent = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const handleButtonPress = () => {};
  return (
    <View style={[styles.connectionInfo, { flex: 1, alignItems: "center" }]}>
      <Text h6 b style={{ marginBottom: 5 }}>
        {params.fullName}
      </Text>

      <Image style={styles.profileImage} source={{ uri: params.imageurl }} />
      {/* <Text s>Something below the image</Text> */}
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProfileDetailsScreen", { uid: params.userId })
          }
          style={styles.menuButtonStyle}
        >
          <Text style={styles.buttonText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MessageDetails = () => {
  const currentUserId = auth.currentUser.uid;
  const [messages, setMessage] = useState([]);
  const [inputText, setInputText] = useState("");
  const [hidden, setHidden] = useState(false);
  const [tempStorage, setTempStorage] = useState({
    text: "",
    image: "",
    audio: null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [recording, setRecording, isRecording, setIsRecording, currentUser] =
    useStore(
      useShallow((state) => [
        state.recording,
        state.setRecording,
        state.isRecording,
        state.setIsRecording,
        state.currentUser,
      ])
    );
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [durationMillis, setDurationMillis] = useState("00:00:00");
  const { params } = useRoute();
  const navigation = useNavigation();
  const { showNotification } = useNotification();

  // Use useFocusEffect to execute the function when the screen gains focus

  useEffect(() => {
    const chatsRef = ref(db, `dms/${params.chatid}/chats`);
    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(JSON.stringify(data, null, 2));
      if (data) {
        const newdata = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        // Reverse the order of messages to show the latest one first
        const reversedChats = newdata.reverse();
        setMessage(reversedChats);
      }
    });
  }, []);

  function generateRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  const sendMessage = async () => {
    const date = Date.now();
    const id = generateRandomString(26);
    let newMessage;

    if (selectedImage !== null) {
      setTempStorage((prevState) => ({
        ...prevState,
        text: inputText,
        image: selectedImage,
      }));
      newMessage = {
        id: id,
        type: "image",
        message: inputText, // Image message could be empty or contain a description
        author: currentUserId,
        read: false,
        seenAt: 0,
        seenBy: false,
        sent: false,
        imageurl: selectedImage,
      };
      setMessage((prev) => [newMessage, ...prev]);
      setSelectedImage(null);
      setInputText("");
      try {
        const imageurl = await handleImageUpload();

        if (imageurl) {
          const body = {
            matchid: params.userId,
            message: inputText,
            imageurl,
            type: newMessage.type,
            hidden,
          };
          await SendMessage({ token: auth.currentUser.uid, body: body });

          setTempStorage(() => ({ text: "", image: "", audio: null }));
        } // Clear temp storage
      } catch (error) {
        console.error("Error sending message:", error);
        // If sending fails, you might want to handle the error here
      }
    }
    if (recording !== null) {
      setInputText("");
      const audioUrl = await extractRecording();
      newMessage = {
        id: id,
        type: "audio",
        message: "", // Audio message could be empty or contain a description
        author: currentUserId,
        read: false,
        seenAt: 0,
        seenBy: false,
        sent: false,
        audioUrl: audioUrl,
        duration: durationMillis,
      };
      setMessage((prev) => [newMessage, ...prev]);
      try {
        const audiolink = await handleAudioUpload(audioUrl);
        if (audioUrl) {
          const body = {
            matchid: params.userId,
            message: inputText,
            type: newMessage.type,
            audioUrl: audiolink,
            duration: newMessage.duration,
            hidden,
          };
          await SendMessage({ token: auth.currentUser.uid, body: body });

          setTempStorage(() => ({ text: "", image: "", audio: null })); // Clear temp storage
        }
      } catch (error) {}
    }

    if (inputText.trim() !== "" && selectedImage == null && recording == null) {
      setTempStorage((prevState) => ({
        ...prevState,
        text: inputText,
      }));
      newMessage = {
        id: id,
        type: "text",
        message: inputText,
        author: currentUserId,
        read: false,
        seenAt: 0,
        seenBy: false,
        sent: false,
      };
      setMessage((prev) => [newMessage, ...prev]);
      setInputText("");
      try {
        const body = {
          matchid: params.userId,
          message: inputText,
          type: newMessage.type,
          hidden,
        };
        await SendMessage({ token: auth.currentUser.uid, body: body });

        setTempStorage(() => ({ text: "", image: "", audio: null })); // Clear temp storage
      } catch (error) {
        setInputText(tempStorage.text);
      }
    }
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
      if (selectedImage) {
        const blob = await uriToBlob(selectedImage);
        const path = `dms/${auth?.currentUser?.uid}/${blob._data.name}`;
        const imageRef = refff(storage, path);

        await uploadBytes(imageRef, blob);

        // Get the download URL of the uploaded file
        const downloadURL = await getDownloadURL(imageRef);

        return downloadURL; // Return the download URL
      } else {
        return "";
      }
    } catch (error) {
      setSelectedImage(tempStorage.image);
      setInputText(tempStorage.text);
      console.log(error);
      showNotification("Couldnt upload image");
      // Return null to indicate an error
    }
  };
  const handleAudioUpload = async (audio) => {
    try {
      const randomstring = currentUserId + generateRandomString(26);
      const blob = await uriToBlob(audio);
      console.log({ blob });
      const path = `dms/${auth?.currentUser?.uid}/${blob._data.name}`;
      const audioRef = refff(storage, path);

      await uploadBytes(audioRef, blob);

      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(audioRef);

      if (downloadURL) {
        return downloadURL; // Return the download URL
      }
      return null;
    } catch (error) {
      showNotification("Couldnt send audio");
      // Return null to indicate an error
    }
  };
  function createTimer() {
    let elapsedTime = 0;
    let intervalId = null;
    let duration = 60; // Default duration of 60 seconds

    function start() {
      if (intervalId) {
        clearInterval(intervalId);
      }
      intervalId = setInterval(() => {
        elapsedTime++;

        const time = durationMillis(elapsedTime);
        // Assuming you have a function to display the time, update it accordingly
        displayTime(time);
        if (elapsedTime >= duration) {
          clearInterval(intervalId);
          setDurationMillis("00:00:00");
          stopRecording(); // Notify onFinish function when duration is reached
        }
      }, 1000);
    }

    function pause() {
      clearInterval(intervalId);
    }

    function resume() {
      start();
    }

    function reset() {
      elapsedTime = 0;
      // Assuming you have a function to display the time, update it accordingly
      displayTime("00:00:00");
    }

    function durationMillis(millis) {
      const hours = Math.floor(millis / 3600);
      const minutes = Math.floor((millis % 3600) / 60);
      const seconds = Math.floor(millis % 60);
      return updateClock(hours, minutes, seconds);
    }

    function updateClock(hours, minutes, seconds) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    function displayTime(time) {
      // Assuming you have a function to display the time, update it accordingly
      setDurationMillis(time);
    }

    return { start, pause, resume, reset };
  }

  const timer = createTimer(); // 60 seconds

  useEffect(() => {}, [isRecording, recording]);
  useFocusEffect(
    useCallback(() => {
      // Add event listener for navigation events
      const unsubscribe = navigation.addListener("beforeRemove", (e) => {
        // Prevent default behavior of navigation (e.g., closing the screen)

        if (recording !== null || isRecording == true) {
          e.preventDefault();
          pauseRecording();
          showAlert();
        }
      });

      // Cleanup function to remove the event listener
      return () => unsubscribe();
    }, [navigation, isRecording, recording]) // Depend on navigation to re-subscribe to the event listener when navigation changes
  );

  const startRecording = async () => {
    try {
      if (permissionResponse.status !== "granted") {
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording?.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setIsRecording(true);
      setRecording(recording);
      timer.start();
    } catch (err) {
      showNotification("Could not start recording at the moment");
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);

      setRecording(null);
      await recording?.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      setDurationMillis("00:00:00");
      timer.reset();
      // const uri = recording?.getURI();
      // console.log("Recording stopped and stored at", uri);
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  const extractRecording = async () => {
    try {
      setDurationMillis("00:00:00");
      timer.reset();
      setIsRecording(false);
      setRecording(null);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      return uri;
    } catch (error) {}
  };
  const pauseRecording = async () => {
    if (isRecording) {
      // If currently recording, pause the recording
      console.log("Pausing recording..");
      await recording.pauseAsync();
      setIsRecording(false);
      timer.pause();
    } else {
      // If currently paused, resume the recording
      console.log("Resuming recording..");
      await recording.startAsync();
      setIsRecording(true);
      timer.resume();
    }
  };

  const showAlert = () => {
    Alert.alert(
      "Cancel Recording",
      "Are you sure you want to cancel recording?",
      [
        {
          text: "Cancel",
          onPress: () => stopRecording(),
          style: "cancel",
        },
        { text: "Continue", onPress: () => pauseRecording() },
      ],
      { cancelable: false }
    );
  };
  const renderItem = ({ item, index }) => {
    if (item) {
      return (
        <>
          <MessageParts message={item} isSubscribed={currentUser?.subscribed} />
          {index % 12 == 0 && !currentUser?.subscribed && (
            <SubscriptionSuggestion
              text={"see whether your messages have been read"}
            />
          )}
        </>
      );
    }
    return null;
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, marginBottom: 70 }}
        behavior="padding"
      >
        <View
          style={{ position: "absolute", top: 0, width: "100%", zIndex: 4 }}
        >
          <ChatHeader params={params} />
        </View>
        <FlatList
          ListFooterComponent={<HeaderComponent />}
          renderItem={renderItem}
          data={messages}
          inverted
          initialNumToRender={14}
          contentContainerStyle={{
            paddingBottom: 70,
            flexGrow: 1,
            paddingHorizontal: 10,
          }} // Adjusted paddingBottom
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>Be the first to message ❤️❤️</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>

      <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <InputArea
          sendMessage={sendMessage}
          inputText={inputText}
          setInputText={setInputText}
          selectedImage={selectedImage}
          pickImage={() => pickImage()}
          recording={recording}
          stopRecording={stopRecording}
          startRecording={startRecording}
          isRecording={isRecording}
          duration={durationMillis}
          pauseRecording={pauseRecording}
          hidden={hidden}
          setHidden={() => setHidden(!hidden)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    height: "100%",
  },
  chatBox: {
    flex: 1,
    padding: 10,
  },
  recipientRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-end",
  },

  voiceNoteContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },

  chatBubble: {
    flexDirection: "row",
    backgroundColor: "#FF355E",
    borderRadius: 25,
    padding: 10,
    alignItems: "flex-end",
  },
  voiceNoteText: {
    marginLeft: 10,
    color: "white",
    fontSize: 16,
  },
  senderRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 15,
  },
  recipientBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 15,
    maxWidth: "70%",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  senderBubble: {
    backgroundColor: "#FF355E",
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 15,
    maxWidth: "70%",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  recipientText: {
    color: "#000",
  },
  senderText: {
    color: "#FFFFFF",
  },

  chatBox: {
    flex: 1,
    padding: 10,
  },
  chatContent: {
    paddingBottom: 70, // Add padding to ensure content isn't hidden
  },

  chatBox: {
    flex: 1,
    padding: 10,
  },
  chatContent: {
    paddingBottom: 70, // Padding to ensure content isn't hidden by input
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  inputWithIcons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
  },
  insideInputIcon: {
    marginRight: 8,
  },
  iconButton: {
    padding: 5,
  },
  sendButton: {
    marginLeft: 5,
    backgroundColor: "#FF6347",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  profileName: {
    fontWeight: "bold",
  },
  connectionInfo: {
    alignItems: "center",
    padding: 20,
    marginBottom: 15,
  },
  connectionText: {
    marginBottom: 10,
    fontStyle: "italic",
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderWidth: 5,
    borderColor: "#FF6347",
    borderRadius: 200,
    marginBottom: 10,
  },
  imageSubtitle: {
    fontWeight: "bold",
    fontSize: 18,
  },

  menuButtonStyle: {
    backgroundColor: "#f91545", // Blue background
    borderRadius: 10,
    paddingHorizontal: 10, // Minimal padding
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 10,
    // Small font size
    color: "#FFFFFF", // White font color
  },
});

export default MessageDetails;
