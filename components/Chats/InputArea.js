import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useNotification } from "../../context/Notifications";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../Colors";
import Recording from "./Recording";
const InputArea = ({
  sendMessage,
  inputText,
  setInputText,
  selectedImage,
  pickImage,
  recording,
  stopRecording,
  startRecording,
  isRecording,
  duration,
  pauseRecording,
  hidden,
  setHidden,
}) => {
  const navigation = useNavigation();
  const { showNotification } = useNotification();
  const enlargeImage = () => {
    navigation.navigate({
      name: "View Image",
      params: { image: selectedImage },
    });
  };

  return (
    <View style={styles.inputContainer}>
      {recording ? (
        <Recording
          recording={recording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          duration={duration}
          isRecording={isRecording}
          pauseRecording={pauseRecording}
          hidden={hidden}
          setHidden={setHidden}
        />
      ) : (
        <>
          <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
            <FontAwesome name="camera" size={24} color="#555" />
          </TouchableOpacity>
          {selectedImage && (
            <TouchableOpacity
              style={{ height: 50, width: 50 }}
              onPress={() => enlargeImage()}
            >
              <Image
                source={{ uri: selectedImage }}
                resizeMode="cover"
                style={{ height: "100%", width: "100%", borderRadius: 5 }}
              />
            </TouchableOpacity>
          )}
          <View style={styles.inputWithIcons}>
            <TextInput
              cursorColor={Colors.light.acccent}
              value={inputText}
              onChangeText={setInputText}
              style={styles.input}
              placeholder="Send a message..."
            />
            <TouchableOpacity
              onPress={() => setHidden()}
              style={styles.insideInputIcon}
            >
              <FontAwesome
                name={"eye-slash"}
                size={20}
                color={hidden ? "red" : "#888"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => startRecording()}
              style={styles.insideInputIcon}
            >
              <FontAwesome name={"microphone"} size={20} color="#888" />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.insideInputIcon}>
            <FontAwesome name="smile-o" size={20} color="#888" />
          </TouchableOpacity> */}
          </View>
        </>
      )}

      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <FontAwesome name="send" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
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
    gap: 5,
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
});

export default InputArea;
