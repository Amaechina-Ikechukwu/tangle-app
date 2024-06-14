import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useEffect } from "react";
import Colors from "../../../Colors";
import { useNavigation } from "@react-navigation/native";
import { SeenNotifications } from "../../../services/Notifications/api";
import { auth } from "../../../firebase";
import GetFirstName from "../../../utils/GetFirstName";
import emptyimagestring from "../../../utils/emptyimagestring";
const { width } = Dimensions.get("screen");
export default function PostNotification({ item, getNotifications }) {
  const {
    type,
    subtype,
    imageurl = "",
    id,
    readNotification,
    actionByData,
  } = item;
  const navigation = useNavigation();
  const goToPost = async () => {
    navigation.navigate({
      name: "Comments",
      params: { item: item },
    });
    await seenNotification();
  };
  const seenNotification = async () => {
    await SeenNotifications({
      token: auth?.currentUser.uid,
      notificationid: id,
    });
    getNotifications();
  };
  return (
    <TouchableOpacity
      onPress={goToPost}
      style={[
        styles.notificationpill,
        {
          backgroundColor: readNotification
            ? Colors.light.background
            : Colors.light.tabIconDefault,
        },
      ]}
    >
      <TouchableOpacity>
        <Image
          source={{ uri: actionByData?.imageurl || emptyimagestring }}
          style={styles.profileimage}
        />
      </TouchableOpacity>
      <Text>
        {subtype == "like"
          ? `${GetFirstName(actionByData?.fullName)} liked your post`
          : `${GetFirstName(actionByData?.fullName)} commented on your post`}
      </Text>
      <TouchableOpacity>
        <Image
          source={{ uri: imageurl || emptyimagestring }}
          style={styles.postimage}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  profileimage: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  postimage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  notificationpill: {
    flexDirection: "row",
    gap: 4,

    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
    width: width,
    position: "relative",
  },
});
