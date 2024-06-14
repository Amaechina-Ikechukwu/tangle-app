import React, { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";
import { navigate } from "../../../navigations/navigationRef";
import { ChatList } from "../../../services/Chats/api";
import { auth, db } from "../../../firebase";
import { useStore } from "../../../store/store";
import { useShallow } from "zustand/react/shallow";
import ActivityLoader from "../../../utils/ActivityLoader";
import { Badge } from "react-native-paper";
import { onValue, ref } from "firebase/database";
import RecentMatches from "../../../components/Match/RecentMarches";

const recentMatches = [
  {
    id: "a",
    imageUrl: require("../../../assets/images/onboarding/face_1.jpg"),
  },
  {
    id: "b",
    imageUrl: require("../../../assets/images/onboarding/face_2.jpg"),
  },
];

const ChatScreen = () => {
  const [chatList, setChatList] = useStore(
    useShallow((state) => [state.chatList, state.setChatList])
  );
  const GetChatList = async () => {
    const { result } = await ChatList({ token: auth.currentUser.uid });

    setChatList(result);
  };
  useEffect(() => {}, [chatList]);
  const handleMessageClick = (item) => {
    navigate({
      name: "MessageDetails",
      params: {
        chatid: item.lastMessage.chatid,
        userId: item.userKey,
        ...item.userData,
      },
    });
  };
  const IsOnline = ({ uid }) => {
    let status;
    const userRef = ref(db, "users/" + uid + "/status");
    onValue(userRef, (snapshot) => {
      status = snapshot.val();
    });
    return status;
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.recentMatchContainer}>
        <Text style={styles.recentMatchText}>Recent Matches</Text>
        <RecentMatches />
      </View>

      <FlatList
        ListEmptyComponent={
          <ActivityLoader
            loadingFor={"Chats"}
            data={chatList}
            reloadFunction={GetChatList}
          />
        }
        data={chatList}
        keyExtractor={(item) => item.userKey}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.messageContainer}
            onPress={() => handleMessageClick(item)}
          >
            <View style={styles.iconContainer}>
              <Image
                source={{ uri: item.userData.imageurl }}
                style={styles.avatarImage}
              />
              <View
                style={[
                  styles.onlineDot,
                  IsOnline({ uid: item.userKey }) == "online"
                    ? styles.online
                    : styles.offline,
                ]}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sender}>{item.userData.fullName}</Text>
              <Text style={styles.message}>
                {item.lastMessage.author == auth.currentUser.uid && "You: "}
                {item.lastMessage.hidden
                  ? "Hidden Message "
                  : item.lastMessage.type !== "text"
                  ? item.lastMessage.type
                  : item.lastMessage.message}
              </Text>
            </View>
            {item.unread !== 0 && (
              <Badge style={{ backgroundColor: "red" }}>{item.unread}</Badge>
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    borderRadius: 100,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  online: {
    backgroundColor: "green",
  },
  offline: {
    backgroundColor: "red",
  },
  messageContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
    alignItems: "center",
    borderRadius: 100,
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  sender: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  message: {
    color: "#777",
  },

  recentMatchContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#4B164C",
    padding: 20,
  },
  recentMatchText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  matchContainer: {
    marginRight: 15,
  },
  matchImage: {
    width: 60,
    height: 90,
    borderRadius: 5,
  },

  listContainer: {
    margin: 10,
    borderRadius: 10,
    // backgroundColor: '#FAFAFA', // or whatever background color you want
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // for Android
  },

  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // half of width and height to make it circular
  },
});

export default ChatScreen;
