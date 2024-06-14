import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../Colors";
import { Checkbox } from "react-native-paper";
import { CustomTextInput } from "../../Themed";
import { GeneralPost } from "../../apis/Post/General";
import { auth } from "../../firebase";
import { useNotification } from "../../context/Notifications";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";
import { GetBlockedUsers } from "../../services/Accounts/api";
import ActivityLoader from "../../utils/ActivityLoader";
import { navigate } from "../../navigations/navigationRef";
const { width } = Dimensions.get("screen");

export default function ViewBlockedUsers({ navigation }) {
  const [blockedUsers, setBlockedUsers] = useStore(
    useShallow((state) => [state.blockedUsers, state.setBlockedUsers])
  );
  const getBlockedUsers = async () => {
    const { result } = await GetBlockedUsers({ token: auth.currentUser.uid });
    setBlockedUsers(result);
  };
  useEffect(() => {
    getBlockedUsers();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: "100%" }}
        contentContainerStyle={{ gap: 10 }}
        data={blockedUsers}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigate({
                  name: "ProfileDetailsScreen",
                  params: { uid: item.userKey },
                })
              }
              style={styles.innerCheckboxView}
            >
              <Image
                source={{ uri: item.imageurl }}
                style={styles.avatarImage}
              />
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {item.fullName}
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => item.userKey}
        ListEmptyComponent={
          <View style={styles.container}>
            <ActivityLoader
              loadingFor={"Blocked Users"}
              data={blockedUsers}
              reloadFunction={() => getBlockedUsers}
            />
          </View>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 20,
    height: "100%",
  },
  innerCheckboxView: {
    flexDirection: "row",
    alignItems: "center",
    width: width,
    gap: 5,
    backgroundColor: Colors.dark.tint,
    padding: 10,
  },
  button: {
    backgroundColor: Colors.light.acccent,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 10,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // half of width and height to make it circular
  },
});
