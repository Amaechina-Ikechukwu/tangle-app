import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { GetLikeCount, LikePost, UnLikePost } from "../../services/Posts/api";
import { auth } from "../../firebase";
import Colors from "../../Colors";
import { useNotification } from "../../context/Notifications";
import { navigate } from "../../navigations/navigationRef";
export default function LikeComponent({
  postid,
  liked,
  isSubscribed,
  isCurrentUserPost,
}) {
  const [like, setLike] = useState(liked);
  const [count, setCount] = useState(0);
  const { showNotification } = useNotification();
  const likeCount = async () => {
    const result = await GetLikeCount({
      token: auth?.currentUser?.uid,
      postid: postid,
    });
    setCount(result);
  };
  useEffect(() => {
    likeCount();
  }, []);
  const reaction = async () => {
    if (like == false || like == null) {
      setLike(true);
      const result = await LikePost({
        token: auth?.currentUser?.uid,
        body: { postid, location: "" },
      });
      setLike(true);
      setCount((prev) => prev + 1);
    } else {
      setLike(false);
      const result = await UnLikePost({
        token: auth?.currentUser?.uid,
        body: { postid, location: "" },
      });
      setLike(false);
      setCount((prev) => prev - 1);
    }
    likeCount();
  };
  const seeLikeList = () => {
    // if (!isCurrentUserPost) {
    //   if (isSubscribed) {
    //     navigate({
    //       name: "List Of Users On Action",
    //       params: {
    //         name: "List Of Likes",
    //         url: `posts/likelist?postid=${postid}`,
    //       },
    //     });
    //   } else {
    //     showNotification("You need premium access to view likes");
    //   }
    // } else {
    navigate({
      name: "List Of Users On Action",
      params: {
        name: "List Of Likes On Your Post",
        url: `posts/likelist?postid=${postid}`,
      },
    });
    // }
  };
  return (
    <View style={styles.iconWrapper}>
      <TouchableOpacity onPress={reaction}>
        <FontAwesome
          name="thumbs-up"
          size={20}
          color={like ? Colors.light.acccent : "#FFFFFF"}
        />
      </TouchableOpacity>
      {count !== 0 && (
        <TouchableOpacity
          onPress={seeLikeList}
          style={{ flexDirection: "row", gap: 2, alignItems: "center" }}
        >
          <Text style={{ color: "white" }}>{count}</Text>
          <FontAwesome name="angle-right" size={16} color={"#FFFFFF"} />
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  iconWrapper: {
    backgroundColor: "rgba(128, 128, 128, 0.7)", // semi-transparent grey
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginBottom: 3,
  },
});
