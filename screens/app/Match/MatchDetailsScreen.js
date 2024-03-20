import React, { useRef, useEffect } from "react";
import { View, Image, StyleSheet, Text, Button } from "react-native";
import LeftHeartCutoutImage from "../../../components/feature/LeftHeartCutoutImage";
import RightHeartCutoutImage from "../../../components/feature/RightHeartCutoutImage";
import CircularProgressBar from "../../../components/feature/CircularProgressBar";
import MatchInterestContainer from "../../../components/Match/MatchInterestContainer";
import { useStore } from "../../../store/store";
import { useShallow } from "zustand/react/shallow";
import { useNavigation, useRoute } from "@react-navigation/native";
import { InitializeDm } from "../../../services/Chats/api";
import { auth } from "../../../firebase";
import { navigate } from "../../../navigations/navigationRef";
import { useNotification } from "../../../context/Notifications";

const MatchDetailScreen = () => {
  const [currentUser, setChattingWith] = useStore(
    useShallow((state) => [state.currentUser, state.setChattingWith])
  );
  const route = useRoute();
  const { user } = route.params;
  const { showNotification } = useNotification();
  const initializedm = async () => {
    showNotification("Tangling you both ❤️❤️");
    const { result } = await InitializeDm({
      token: auth.currentUser.uid,
      body: { matchid: user.userId },
    });
    console.log(result);
    setChattingWith({ chatid: result, ...user });
    navigate({
      name: "MessageDetails",
      params: { chatid: result, ...user },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        You and{" "}
        <Text style={{ color: "#f62459" }}>{user?.fullName.split(" ")[0]}</Text>{" "}
        like each other
      </Text>

      <View style={styles.imageContainer}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <LeftHeartCutoutImage source={{ uri: currentUser?.imageurl }} />
        </View>

        <View
          style={{ justifyContent: "center", alignItems: "center", zIndex: 2 }}
        >
          <CircularProgressBar progress={user.matchPercentage} />
        </View>

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <RightHeartCutoutImage source={{ uri: user?.imageurl }} />
        </View>
      </View>

      <MatchInterestContainer
        interests={user.commonInterests}
        goToChat={initializedm}
        user={user}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffe4e4",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  faceImage: {
    width: 100,
    height: 100,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "column",
    marginBottom: 10,
  },
  imageStyle: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
});

export default MatchDetailScreen;
