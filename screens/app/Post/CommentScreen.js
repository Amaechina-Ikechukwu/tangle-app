import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import ActivityLoader from "../../../utils/ActivityLoader";
import DatingProfileCard from "../../../components/feature/DatingProfileCard";
import { CustomTextInput } from "../../../Themed";
import { auth } from "../../../firebase";
import { GeneralPost } from "../../../apis/Post/General";
import { GeneralGet } from "../../../apis/Get/General";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../../../Colors";
import { useNotification } from "../../../context/Notifications";
const CommentComponent = ({ item }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
      }}
    >
      <View>
        <Image
          source={{ uri: item.userData.imageurl }}
          style={[
            styles.avatar,
            {
              transform: [{ scale: 0.8 }],
            },
          ]}
        />
      </View>
      <View style={{ gap: 3 }}>
        <Text style={[styles.profileName, { fontSize: 14 }]}>
          {item.userData.fullName}, {item.userData.age}
        </Text>
        <Text style={{ fontWeight: 700 }}>{item?.comment}</Text>
      </View>
    </View>
  );
};
export default function CommentScreen() {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState([]);
  const [ready, setReady] = useState(false);
  const { showNotification } = useNotification;
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const postComments = async () => {
    try {
      const body = { comment, location: "", postid: item?.postid };
      await GeneralPost("posts/addcomment", auth?.currentUser.uid, body);

      getComments();
      setComment("");
    } catch {
      showNotification("Could not send comment at the moment");
    }
  };
  const getComments = async () => {
    const result = await GeneralGet(
      "posts/getcomments?postid=" + item.postid,
      auth?.currentUser.uid
    );
    setComments(result);
  };
  useEffect(() => {
    getComments();
  }, []);
  useEffect(() => {
    if (comment.length > 5) {
      setReady(true);
    } else {
      setReady(false);
    }
  }, [comment]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={comments}
        contentContainerStyle={{ gap: 10, padding: 5 }}
        renderItem={({ item }) => <CommentComponent item={item} />}
        ListEmptyComponent={
          <ActivityLoader
            data={comments}
            reloadFunction={getComments}
            loadingFor={"Comments"}
          />
        }
        ListHeaderComponent={
          <DatingProfileCard
            item={item}
            from="comments"
            navigation={navigation}
          />
        }
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: 5,
        }}
      >
        <CustomTextInput
          placeholder={`Comment on ${
            item.userData.fullName.split(" ")[0]
          }'s post`}
          keyboardType="default"
          value={comment}
          onChange={(text) => setComment(text)}
          style={{ width: "90%" }}
        />
        <TouchableOpacity
          disabled={ready == false}
          onPress={postComments}
          style={styles.postIconContainer}
        >
          <Icon
            name="paper-plane"
            size={24}
            color={ready == false ? "gray" : Colors.light.acccent}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  // Post Styles

  postIconContainer: {
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // Makes the avatar circular
    marginRight: 10, // Spacing between avatar and name
  },
});
