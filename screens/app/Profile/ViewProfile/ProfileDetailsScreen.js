import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  FlatList,
  ImageBackground,
} from "react-native";
import { View as Box } from "../../../../Themed";
import { Card, Button } from "galio-framework";
import { useStore } from "../../../../store/store";
import { useShallow } from "zustand/react/shallow";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth } from "../../../../firebase";
import Colors from "../../../../Colors";
import { Entypo } from "@expo/vector-icons";
import {
  BlockAction,
  BlockedByMe,
  GetProfile,
  GetProfileLikeCount,
  IsProfileLikedByMe,
  LikeProfile,
} from "../../../../services/Profile/api";
import { ChatList, InitializeDm } from "../../../../services/Chats/api";
import { useNotification } from "../../../../context/Notifications";
import { navigate } from "../../../../navigations/navigationRef";
import { GetPosts } from "../../../../services/Posts/api";
const InterestsCompoment = ({ data }) => {
  const colors = [
    "#4ade80",
    "#60a5fa",
    "#fb7185",
    "#d946ef",
    "#a78bfa",
    "#38bdf8",
    "#facc15",
    "#22d3ee",
  ];
  const hexToRGBA = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const generateRandomNumbers = () => {
    let number = 0;
    number = Math.floor(Math.random() * (8 - 0 + 1)) + 0;
    if (number > 6) {
      return generateRandomNumbers();
    }
    return number;
  };
  const listInterests = [
    {
      id: 1,
      label: "Travelling",
      picture:
        "https://images.pexels.com/photos/1252500/pexels-photo-1252500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 1.5,
      label: "Travelling",
      picture:
        "https://images.pexels.com/photos/1252500/pexels-photo-1252500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 2,
      label: "Movies",
      picture:
        "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 3,
      label: "Music",
      picture:
        "https://images.pexels.com/photos/1876279/pexels-photo-1876279.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 4,
      label: "Foodie",
      picture:
        "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 5,
      label: "Outdoor Activities",
      picture:
        "https://images.pexels.com/photos/9508460/pexels-photo-9508460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 6,
      label: "Sports",
      picture:
        "https://images.pexels.com/photos/61135/pexels-photo-61135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 7,
      label: "Cooking",
      picture:
        "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 8,
      label: "Reading",
      picture:
        "https://images.pexels.com/photos/1031588/pexels-photo-1031588.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 9,
      label: "Art & Culture",
      picture:
        "https://images.pexels.com/photos/6424244/pexels-photo-6424244.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 9.5,
      label: "Art & Culture",
      picture:
        "https://images.pexels.com/photos/6424244/pexels-photo-6424244.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 10,
      label: "Gaming",
      picture:
        "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 11,
      label: "Fitness",
      picture:
        "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 12,
      label: "Dancing",
      picture:
        "https://images.pexels.com/photos/5152595/pexels-photo-5152595.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    // Add more interests as necessary...
  ];
  const matchPicture = (item) => {
    let picture;
    listInterests.forEach((interest) => {
      if (interest.label.toLowerCase() == item.toLowerCase()) {
        picture = interest.picture;
      }
    });

    return picture;
  };
  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      data={data}
      horizontal
      contentContainerStyle={{ gap: 5 }}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => {
        return (
          <ImageBackground
            source={{ uri: matchPicture(item) }}
            imageStyle={{ borderRadius: 20 }}
          >
            <View
              style={{
                height: 150,
                width: 190,
                borderRadius: 20,
                backgroundColor: hexToRGBA(
                  colors[generateRandomNumbers()],
                  0.6
                ),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20, color: "white", fontWeight: 800 }}>
                {item}
              </Text>
            </View>
          </ImageBackground>
        );
      }}
    />
  );
};
const ProfileDetailsScreen = () => {
  const { params } = useRoute();
  const { showNotification } = useNotification();
  const [chatList, currentUser, setChattingWith, setChatList, setPosts] =
    useStore(
      useShallow((state) => [
        state.chatList,
        state.currentUser,
        state.setChattingWith,
        state.setChatList,
        state.setPosts,
      ])
    );
  const [otherProfile, setOtherProfile] = useState({
    userData: undefined,
    userKey: "",
    lastMessage: undefined,
  });
  const [profileState, setProfileState] = useState({
    liked: false,
    blocked: false,
    count: 0,
  });
  const navigation = useNavigation();

  const initializeData = async () => {
    try {
      let userData, lastMessage, userKey;

      const chatListItem = chatList.find((list) => list.userKey === params.uid);

      if (chatListItem) {
        userData = chatListItem.userData;
        lastMessage = chatListItem.lastMessage;
        userKey = chatListItem.userKey;
      } else {
        const { result } = await GetProfile({
          token: params.uid,
          body: { user: params.uid },
        });

        userData = result;
        userKey = result.userKey;
      }

      setOtherProfile({ userData, userKey, lastMessage });
    } catch (error) {
      console.error("Error while initializing data:", error);
    }
  };

  const { userData, lastMessage, userKey } = otherProfile;
  const { liked, blocked, count } = profileState;

  const data = params.uid == auth.currentUser.uid ? currentUser : userData;
  const isCurreentUser = params.uid == auth.currentUser.uid;
  const handleMessageClick = async () => {
    if (!lastMessage) {
      showNotification("Tangling you both ❤️❤️");
      const { result } = await InitializeDm({
        token: auth.currentUser.uid,
        body: { matchid: data.userKey },
      });

      setChattingWith({ chatid: result, ...data });
      navigate({
        name: "MessageDetails",
        params: { chatid: result, ...data },
      });
    } else {
      navigation.navigate({
        name: "MessageDetails",
        params: {
          chatid: lastMessage.chatid,
          userId: userKey,
          ...data,
        },
      });
    }
  };
  const isprofileliked = async () => {
    const result = await IsProfileLikedByMe({
      token: auth?.currentUser.uid,
      matchid: params.uid,
    });
    setProfileState((prev) => ({ ...prev, liked: result }));

    return result;
  };
  const profileLikeCount = async () => {
    const result = await GetProfileLikeCount({
      token: auth?.currentUser.uid,
      matchid: params.uid,
    });
    setProfileState((prev) => ({ ...prev, count: result }));

    return result;
  };
  const isprofileblocked = async () => {
    const result = await BlockedByMe({
      token: auth?.currentUser.uid,
      matchid: params.uid,
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
        body: { matchid: params.uid },
      });

      const { result: chatlist } = await ChatList({
        token: auth?.currentUser.uid,
      });
      setChatList(chatlist);

      setProfileState((prev) => ({ ...prev, blocked: result }));
      if (result == true) {
        setTimeout(() => {
          navigation.navigate("Chat");
        }, 1500);
      }

      return result;
    } catch {}
  };
  const likeProfile = async () => {
    await LikeProfile({
      token: auth?.currentUser.uid,
      body: { matchid: params.uid },
    });

    isprofileliked();
    profileLikeCount();
    const posts = await GetPosts({ token: auth?.currentUser.uid });
    setPosts(posts);
  };
  useEffect(() => {
    initializeData();
    isprofileliked();
    isprofileblocked();
    profileLikeCount();
  }, []);
  if (!userData) {
    return (
      <Box inverse={true}>
        <ActivityIndicator color={"red"} />
      </Box>
    );
  }
  return (
    <View style={styles.container}>
      {blocked && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
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
      )}
      <View style={styles.imageBackgroundContainer}>
        <Image
          source={{
            uri:
              data?.imageurl ||
              "https://th.bing.com/th/id/R.5e7a4ce24712861a9ef9a3eeeebbc5e7?rik=qDUFB6EcNshmtw&pid=ImgRaw&r=0",
          }} // or any other background image URL
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.darkOverlay} />
        <View style={styles.userInfo}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <Text style={styles.userName}>
              {data?.fullName + ", " + data?.age}
            </Text>
            {isCurreentUser && (
              <Button
                onPress={likeProfile}
                icon={"hearto"}
                iconFamily="antdesign"
                color={"red"}
                iconColor={"#fff"}
                style={{
                  width: 80,
                  height: 45,
                  padding: 10,
                  borderRadius: 100,
                }}
              >
                {count.toString()}
              </Button>
            )}
          </View>

          <Text style={styles.userLocation}>
            {data?.location
              ? data?.location.adminName1 + ", " + data?.location.countryName
              : ""}
          </Text>
        </View>
        {!isCurreentUser && !blocked && (
          <View style={styles.btnContainer}>
            <Button
              onPress={() => handleMessageClick()}
              icon="message1"
              iconFamily="antdesign"
              round
              capitalize
              color={Colors.light.acccent}
            >
              Go To Chat
            </Button>
            <Button
              onPress={likeProfile}
              onlyIcon={count == 0 ? true : false}
              icon={liked == true ? "heart" : "hearto"}
              iconFamily="antdesign"
              color={liked == true ? "red" : "pink"}
              iconColor={liked == true ? "#fff" : "red"}
              style={{ width: 80, height: 45, padding: 10, borderRadius: 100 }}
            >
              {count.toString()}
            </Button>

            <Button
              onPress={blockUser}
              onlyIcon
              icon="block"
              iconFamily="entypo"
              color="#4B164C"
              iconColor="#fff"
              style={{ width: 45, height: 45 }}
            />
          </View>
        )}
      </View>

      <View style={styles.slideUpContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollViewContent}
        >
          <View>
            <Text
              style={[styles.sectionTitle, { color: Colors.light.acccent }]}
            >
              About
            </Text>
            <Text style={styles.sectionContent}>{data?.bio}</Text>
          </View>
          <View>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                width: "100%",
              }}
            >
              <InterestsCompoment data={data.interest} />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f3f3f3',
  },
  imageBackgroundContainer: {
    height: screenHeight * 0.5,
    justifyContent: "center",
  },
  locationContainer: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: Colors.light.acccent,
    flexDirection: "row",
    alignItems: "center",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  darkOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  userInfo: {
    flex: 1,
    justifyContent: "flex-end",
    position: "relative",
    paddingBottom: 20,
  },

  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },

  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  userLocation: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginTop: 5,
  },
  slideUpContainer: {
    height: screenHeight * 0.5,
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 20,
    gap: 20,
  },
  scrollViewContent: {
    paddingVertical: 20,
    flexDirection: "column",
    width: "100%",
    gap: 30,
    height: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  sectionContent: {
    fontSize: 16,
    marginTop: 5,
    lineHeight: 25,
  },
  interestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    borderRadius: 30,
    margin: 7,
  },
});

export default ProfileDetailsScreen;
