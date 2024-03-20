import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { navigate } from "../navigations/navigationRef";

import LoadingOverlay from "./LoadingOverlay";
import { useStore } from "../store/store";
import { useShallow } from "zustand/react/shallow";
import { signOut } from "firebase/auth";
import { ClearAllLocalData } from "../services/Storage";
import { auth } from "../firebase";

const CustomNavbar = (props) => {
  const [currentUser, setCurrentUser] = useStore(
    useShallow((state) => [state.currentUser, state.setCurrentUser])
  );
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onNotificationsPress = () => {};
  const logout = async () => {
    setCurrentUser(null);
    await ClearAllLocalData();
    await signOut(auth);
  };
  const handleLogout = async () => {
    setLoading(true);

    await logout();
    setLoading(false);
  };

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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: currentUser?.imageurl }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 15 }}
          />
          <Text>{currentUser?.fullName?.split(" ")[0]}</Text>
        </View>

        {/* {props.user.firstname} */}
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => setDropdownVisible(!isDropdownVisible)}
          >
            <Ionicons
              name="settings"
              size={24}
              color="black"
              style={{ marginRight: 20 }}
            />
          </TouchableOpacity>

          <Modal
            coverScreen={true}
            transparent={true}
            visible={isDropdownVisible}
            onRequestClose={() => {
              setDropdownVisible(!isDropdownVisible);
            }}
          >
            <TouchableOpacity
              style={styles.modalContainer}
              onPress={() => setDropdownVisible(false)}
            >
              <View style={styles.dropdown}>
                <Text
                  onPress={() => navigate({ name: "Billing" })}
                  style={styles.dropdownItem}
                >
                  Billing
                </Text>
                <Text
                  onPress={() => navigate({ name: "Manage Account" })}
                  style={styles.dropdownItem}
                >
                  Account
                </Text>
                <TouchableOpacity onPress={handleLogout}>
                  <Text style={styles.dropdownItem}>Logout</Text>
                </TouchableOpacity>

                {/* Add more options as needed */}
              </View>
            </TouchableOpacity>
          </Modal>

          <TouchableOpacity onPress={onNotificationsPress}>
            <Ionicons name="notifications-outline" size={24} color="black" />
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
});

export default CustomNavbar;
