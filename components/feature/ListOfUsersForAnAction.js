import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Colors from "../../Colors";
import { Checkbox } from "react-native-paper";
import { CustomTextInput } from "../../Themed";
import { GeneralPost } from "../../apis/Post/General";
import { auth } from "../../firebase";
import { useNotification } from "../../context/Notifications";

import ActivityLoader from "../../utils/ActivityLoader";
import { navigate } from "../../navigations/navigationRef";
import { GeneralGet } from "../../apis/Get/General";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";
import SubscriptionSuggestion from "./SubscriptionSuggestion";
const { width } = Dimensions.get("screen");
export default function ListOfUsersForAnAction({ navigation, route }) {
  const { name, url } = route?.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [navigation]);
  const [currentUser] = useStore(useShallow((state) => [state.currentUser]));
  const [data, setData] = useState([]);
  const getData = async () => {
    const { result } = await GeneralGet(url, auth.currentUser.uid);
    setData(result);
  };
  const { showNotification } = useNotification();
  const goToProfile = (item) => {
    navigate({
      name: "ProfileDetailsScreen",
      params: { uid: item.userKey },
    });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: "100%" }}
        contentContainerStyle={{ gap: 10 }}
        data={data}
        renderItem={({ item, index }) => {
          if (index > 2 && !currentUser?.subscribed) {
            return (
              <SubscriptionSuggestion
                text={`see more people that liked this post, they are many`}
              />
            );
          }
          return (
            <TouchableOpacity
              onPress={() => goToProfile(item)}
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
              loadingFor={name}
              data={data}
              reloadFunction={() => getData}
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
