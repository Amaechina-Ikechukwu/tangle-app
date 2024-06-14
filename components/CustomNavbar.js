import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { navigate } from "../navigations/navigationRef";

import LoadingOverlay from "./LoadingOverlay";
import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";

const CustomNavbar = (props) => {
  const [currentUser, setCurrentUser, notifications] = useStore(
    useShallow((state) => [
      state.currentUser,
      state.setCurrentUser,
      state.notifications,
    ])
  );
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const countNotifications = async () => {
    if (notifications.length > 0) {
      let count = 0;
      for (var i = 0; i < notifications.length; i++) {
        if (notifications[i].readNotification == false) {
          count++;
        }
      }
      setCount(count);
    }
  };
  useEffect(() => {
    countNotifications();
  }, [notifications]);
  return (
    <>
      <LoadingOverlay visible={loading} />
      <View
        style={{
          zIndex: -1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigate({
              name: "ProfileDetailsScreen",
              params: { uid: currentUser?.userKey },
            })
          }
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: currentUser?.imageurl }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 15,
              }}
            />
            <Text>{currentUser?.fullName?.split(" ")[0]}</Text>
          </View>
        </TouchableOpacity>
        {/* {props.user.firstname} */}
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => navigate({ name: "Create Post" })}>
            <Ionicons
              name="add"
              size={24}
              color="black"
              style={{ marginRight: 20 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate({ name: "Manage Account" })}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color="black"
              style={{ marginRight: 20 }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigate({ name: "Notifications" })}>
            <Ionicons
              name={"notifications-outline"}
              size={24}
              color={"black"}
            />
            {count !== 0 && (
              <View style={styles.dot}>
                <Text style={{ color: "white" }}>{count}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  iconSpacing: {
    marginLeft: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60, // Adjust this based on where you want the dropdown to appear
    paddingRight: 10,
  },
  dropdown: {
    width: 150,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  dot: {
    padding: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 510,
    position: "absolute",
    right: 0,
    bottom: 0,
    height: 20,
    width: 20,
  },
});

export default CustomNavbar;
