import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { View as Box } from "../../../Themed";
import { useStore } from "../../../store/store";
import { useShallow } from "zustand/react/shallow";
import ActivityLoader from "../../../utils/ActivityLoader";
import { GetNotifications } from "../../../services/Notifications/api";
import { auth } from "../../../firebase";
import Colors from "../../../Colors";
import { useNotification } from "../../../context/Notifications";
import PostNotification from "./PostNotification";
const { width } = Dimensions.get("screen");

export default function NotificationsHome() {
  const { showNotification } = useNotification();
  const [notifications, setNotifications] = useStore(
    useShallow((state) => [state.notifications, state.setNotifications])
  );
  const getNotifications = async () => {
    const { result } = await GetNotifications({ token: auth?.currentUser.uid });
    setNotifications(result);
  };
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await getNotifications();
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      showNotification("Could not retrieve notifications at the moment");
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => {
    const { type } = item;
    if (type == "posts") {
      return (
        <PostNotification item={item} getNotifications={getNotifications} />
      );
    }
    return <View></View>;
  };
  useEffect(() => {
    if (notifications.length == 0) {
      getNotifications();
    }
  }, []);
  return (
    <View style={styles.container}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 30 }}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        ListEmptyComponent={
          <Box>
            <ActivityLoader
              loadingFor={"Notifications"}
              data={notifications}
              reloadFunction={() => getNotifications()}
            />
          </Box>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF", "red"]} // Customize the loading spinner color(s)
          />
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
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
    backgroundColor: Colors.light.tabIconDefault,
    alignItems: "center",
    padding: 10,
    justifyContent: "space-evenly",
    width: width,
  },
});
