import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { LikePost, UnLikePost } from "../../services/Posts/api";
import { auth } from "../../firebase";
import Colors from "../../Colors";
export default function LikeComponent({ postid, liked }) {
  const [like, setLike] = useState(liked);
  const reaction = async () => {
    if (like == false) {
      setLike(true);
      const result = await LikePost({
        token: auth?.currentUser?.uid,
        body: { postid, location: "" },
      });
      setLike(true);
    } else {
      setLike(false);
      const result = await UnLikePost({
        token: auth?.currentUser?.uid,
        body: { postid, location: "" },
      });
      setLike(false);
    }
  };
  return (
    <View>
      <TouchableOpacity style={styles.iconWrapper} onPress={reaction}>
        <FontAwesome
          name="thumbs-up"
          size={20}
          color={like ? Colors.light.acccent : "#FFFFFF"}
        />
      </TouchableOpacity>
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
    marginBottom: 3,
  },
});
