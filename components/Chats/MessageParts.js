import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Audio } from "expo-av";
import { SeenMessage } from "../../services/Chats/api";
import { FontAwesome5 } from "@expo/vector-icons";
import SubscriptionSuggestion from "../feature/SubscriptionSuggestion";
const convertToSeconds = (timeString) => {
  if (timeString) {
    const parts = timeString?.split(":").map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else {
    return "";
  }
};
export default function MessageParts({ message, isSubscribed }) {
  const navigation = useNavigation();
  const { params } = useRoute();
  const currentUserId = auth.currentUser.uid;
  const who = currentUserId == message.author;
  const {
    type,
    message: text,
    id,
    imageurl,
    audioUrl,
    duration,
    sent,
    hidden,
    read,
    author,
  } = message;
  const enlargeImage = () => {
    navigation.navigate({
      name: "View Image",
      params: { image: imageurl },
    });
  };
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHidden, setShowHidden] = useState(hidden);
  const time = convertToSeconds(duration);
  const [remainingDuration, setRemainingDuration] = useState(time);

  const playSound = async () => {
    try {
      if (!sound) {
        setIsLoading(true);

        const { sound } = await Audio.Sound.createAsync(
          sent ? { uri: audioUrl } : { uri: audioUrl }
        );
        setSound(sound);
        setIsLoading(false);
        await sound.playAsync();
        setIsPlaying(true);
      } else {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error("Failed to play sound", error);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) {
      // Handle error
    } else {
      setRemainingDuration(status.durationMillis / 1000);
      if (status.didJustFinish) {
        // Audio finished playing
        setIsPlaying(false);
        setRemainingDuration(time);
        sound?.stopAsync(); // Stop the sound
      }
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() => {
    if (isPlaying && remainingDuration > 0) {
      const intervalId = setInterval(() => {
        setRemainingDuration((prevDuration) => prevDuration - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else if (remainingDuration === 0) {
      setRemainingDuration(time);
      setIsPlaying(false);
    }
  }, [isPlaying, remainingDuration]);

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }:${seconds < 10 ? "0" + seconds : seconds}`;
  };
  const seenMessage = async () => {
    if (read == false && !who && !hidden) {
      try {
        const body = { matchid: params.userId, chatid: id };
        await SeenMessage({ token: currentUserId, body: body });
      } catch (error) {}
    }
  };
  const openMessage = async () => {
    setShowHidden(false);
    try {
      const body = { matchid: params.userId, chatid: id };
      await SeenMessage({ token: currentUserId, body: body });
    } catch (error) {}
  };
  useEffect(() => {
    seenMessage();
  }, []);

  if (showHidden) {
    return (
      <View>
        {read == true ? (
          <View key={id} style={who ? styles.senderRow : styles.recipientRow}>
            <View style={who ? styles.senderBubble : styles.recipientBubble}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <FontAwesome
                  name={"eye-slash"}
                  size={20}
                  color={who ? "white" : "gray"}
                />
                <Text style={who ? styles.senderText : styles.recipientText}>
                  {who ? "Message has been seen" : "Seen"}
                </Text>
                <View style={{ position: "absolute", bottom: 4, right: 4 }}>
                  {who && isSubscribed && (
                    <FontAwesome5
                      name="check-double"
                      size={10}
                      color={read ? "white" : Colors.light.highlighted}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={() => openMessage()}>
            <View key={id} style={who ? styles.senderRow : styles.recipientRow}>
              <View style={who ? styles.senderBubble : styles.recipientBubble}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <FontAwesome
                    name={"eye-slash"}
                    size={20}
                    color={who ? "white" : "red"}
                  />
                  <Text style={who ? styles.senderText : styles.recipientText}>
                    {who ? "Not yet viewed. Tap" : "Tap to view"}
                  </Text>
                  <View style={{ position: "absolute", bottom: 4, right: 4 }}>
                    {who && isSubscribed && (
                      <FontAwesome5
                        name="check-double"
                        size={10}
                        color={read ? "white" : Colors.light.highlighted}
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
  if (type == "text" || type == undefined || type == null) {
    return (
      <View>
        <View key={id} style={who ? styles.senderRow : styles.recipientRow}>
          <View
            style={
              who
                ? [styles.senderBubble, { flexDirection: "row" }]
                : styles.recipientBubble
            }
          >
            <Text style={who ? styles.senderText : styles.recipientText}>
              {text}
            </Text>
            <View style={{ position: "absolute", bottom: 4, right: 4 }}>
              {who && isSubscribed && (
                <FontAwesome5
                  name="check-double"
                  size={10}
                  color={read ? "white" : Colors.light.highlighted}
                />
              )}
            </View>
          </View>
        </View>
        {!sent && (
          <Text
            style={{ color: Colors.light.tabIconDefault, textAlign: "right" }}
          >
            Sending
          </Text>
        )}
      </View>
    );
  }
  if (type == "image") {
    return (
      <View>
        <View key={id} style={who ? styles.senderRow : styles.recipientRow}>
          <View style={who ? styles.senderBubble : styles.recipientBubble}>
            <TouchableOpacity onPress={() => enlargeImage()}>
              <Image
                source={{ uri: imageurl }}
                resizeMode="cover"
                style={{
                  aspectRatio: 3 / 4,
                  borderRadius: 5,
                  height: 200,
                  width: 200,
                }}
              />
            </TouchableOpacity>

            <Text style={who ? styles.senderText : styles.recipientText}>
              {text}
            </Text>
            <View style={{ position: "absolute", bottom: 4, right: 4 }}>
              {who && isSubscribed && (
                <FontAwesome5
                  name="check-double"
                  size={10}
                  color={read ? "white" : Colors.light.highlighted}
                />
              )}
            </View>
          </View>
        </View>
        {!sent && (
          <Text
            style={{ color: Colors.light.tabIconDefault, textAlign: "right" }}
          >
            Sending
          </Text>
        )}
      </View>
    );
  }
  if (type == "audio") {
    return (
      <View>
        <View key={id} style={who ? styles.senderRow : styles.recipientRow}>
          <View style={who ? styles.senderBubble : styles.recipientBubble}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {isLoading ? (
                <ActivityIndicator
                  size={"small"}
                  color={who ? "white" : "gray"}
                />
              ) : (
                <TouchableOpacity onPress={playSound}>
                  <FontAwesome
                    name={isPlaying ? "pause-circle" : "play-circle"}
                    size={24}
                    color={who ? "white" : "gray"}
                  />
                </TouchableOpacity>
              )}

              <Text
                style={[
                  styles.voiceNoteText,
                  { color: who ? "white" : "gray" },
                ]}
              >
                {isPlaying ? "Playing..." : formatDuration(remainingDuration)}
              </Text>
              <View style={{ position: "absolute", bottom: 4, right: 4 }}>
                {who && isSubscribed && (
                  <FontAwesome5
                    name="check-double"
                    size={10}
                    color={read ? "white" : Colors.light.highlighted}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
        {!sent && (
          <Text
            style={{ color: Colors.light.tabIconDefault, textAlign: "right" }}
          >
            Sending
          </Text>
        )}
      </View>
    );
  }
}

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
