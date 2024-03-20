import React, { useEffect, useState } from "react";
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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Remember to install @expo/vector-icons if you haven't
import { Text } from "galio-framework";
import { useRoute } from "@react-navigation/native";
import { auth, db } from "../../firebase";
import { onValue, ref } from "firebase/database";
import { SendMessage } from "../../services/Chats/api";

const HeaderComponent = () => {
  const { params } = useRoute();

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
          onPress={handleButtonPress}
          style={styles.menuButtonStyle}
        >
          <Text style={styles.buttonText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const InputArea = ({ sendMessage, inputText, setInputText }) => {
  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity style={styles.iconButton}>
        <FontAwesome name="camera" size={24} color="#555" />
      </TouchableOpacity>

      <View style={styles.inputWithIcons}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          style={styles.input}
          placeholder="Send a message..."
        />
        <TouchableOpacity style={styles.insideInputIcon}>
          <FontAwesome name="paperclip" size={20} color="#888" />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.insideInputIcon}>
            <FontAwesome name="smile-o" size={20} color="#888" />
          </TouchableOpacity> */}
      </View>

      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <FontAwesome name="send" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};
const renderItem = ({ item }) => {
  const currentUserId = auth.currentUser.uid;
  if (item) {
    if (item.author !== currentUserId) {
      return (
        <View key={item.id} style={styles.recipientRow}>
          <View style={styles.recipientBubble}>
            <Text style={styles.recipientText}>{item.message}</Text>
          </View>
        </View>
      );
    } else if (item.author === currentUserId && item.content !== "voice_note") {
      return (
        <View key={item.id} style={styles.senderRow}>
          <View style={styles.senderBubble}>
            <Text style={styles.senderText}>{item.message}</Text>
          </View>
        </View>
      );
    } else if (item.author === currentUserId && item.content === "voice_note") {
      return (
        <SafeAreaView key={item.id} style={styles.senderRow}>
          <View style={styles.chatBubble}>
            <FontAwesome name="play-circle" size={24} color="white" />
            <Text style={styles.voiceNoteText}>
              Voice Note ({item.duration})
            </Text>
          </View>
        </SafeAreaView>
      );
    }
  }
  return null;
};

const MessageDetails = () => {
  const [messages, setMessage] = useState([]);
  const [inputText, setInputText] = useState("");
  const { params } = useRoute();

  useEffect(() => {
    const chatsRef = ref(db, `dms/${params.chatid}/chats`);
    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log(JSON.stringify(data, null, 2));
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
  const sendMessage = async () => {
    if (inputText.trim() !== "") {
      const newMessage = {
        id: messages.length + 1,
        type: "sender",
        content: inputText,
      };
      const body = { matchid: params.userId, message: inputText };
      await SendMessage({ token: auth.currentUser.uid, body: body });
      setInputText("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, marginBottom: 70 }}
        behavior="padding"
      >
        <FlatList
          ListFooterComponent={<HeaderComponent />}
          renderItem={renderItem}
          data={messages}
          inverted
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
