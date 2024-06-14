import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Button, Text } from "galio-framework";
import { navigate } from "../../navigations/navigationRef";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";
import { useNotification } from "../../context/Notifications";
import { BlockAction, BlockedByMe } from "../../services/Profile/api";
import { auth } from "../../firebase";
import { ChatList } from "../../services/Chats/api";

const MatchInterestContainer = ({ interests, goToChat, user }) => {
  const { showNotification } = useNotification();
  const handleProfileViewBtn = () => {
    navigate({ name: "ProfileDetailsScreen", params: { uid: user.userId } });
  };
  const [setChatList] = useStore(useShallow((state) => [state.setChatList]));
  const [profileState, setProfileState] = useState({
    liked: false,
    blocked: null,
  });
  const { liked, blocked } = profileState;
  const isprofileblocked = async () => {
    const result = await BlockedByMe({
      token: auth?.currentUser.uid,
      matchid: user.userId,
    });
    setProfileState((prev) => ({ ...prev, blocked: result }));
    return result;
  };
  const blockUser = async () => {
    try {
      const text = blocked ? "Unblocking" : "Blocking";
      showNotification(text);
      const result = await BlockAction({
        token: auth?.currentUser.uid,
        body: { matchid: user.userId },
      });

      const { result: chatlist } = await ChatList({
        token: auth?.currentUser.uid,
      });
      setChatList(chatlist);

      setProfileState((prev) => ({ ...prev, blocked: result }));
      if (result == true) {
        setTimeout(() => {
          navigate({ name: "Chat" });
        }, 1500);
      }

      return result;
    } catch {}
  };
  useEffect(() => {
    isprofileblocked();
  }, []);
  if (blocked == null) {
    return <ActivityIndicator color="red" />;
  }
  return (
    <View style={styles.container}>
      {/* Other details of the match here */}
      <Text style={styles.cardTitle}>Interests</Text>
      <View style={styles.interestsContainer}>
        {interests.map((interest) => (
          <View key={interest.id} style={styles.interestButton}>
            {/* <Icon name={interest.icon} size={24} color={"black"} /> */}
            <Text bold>{interest}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.interestDetailContainer}>
        You have {interests.length} things in common with {user.fullName}. Let’s
        start by talking about things you both like!
      </Text>
      {blocked ? (
        <View
          style={{
            width: "100%",
            alignItems: "center",
          }}
        >
          <Button
            onPress={blockUser}
            icon="block"
            iconFamily="entypo"
            round
            color="#cf2f74"
            style={{ width: "80%" }}
          >
            You blocked this person. Unblock
          </Button>
        </View>
      ) : (
        <View style={styles.InterestButtonContainer}>
          <Button
            shadowless
            round
            color="#f91545"
            style={styles.button}
            onPress={() => goToChat()}
          >
            <Text bold color="white">
              Let's Talk
            </Text>
          </Button>
          <Button
            onPress={handleProfileViewBtn}
            shadowless
            round
            color="grey"
            style={styles.button}
          >
            <Text bold color="black">
              View Profile
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 8,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  interestButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    borderRadius: 30,
  },
  interestLabel: {
    color: "#000",
    marginLeft: 1,
    fontWeight: "bold",
  },
  interestDetailContainer: {
    fontSize: 16,
    padding: 8,
  },
  InterestButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10, // optional: add some vertical margin for spacing
  },
  button: {
    width: "80%",
    height: 50,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MatchInterestContainer;
