import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "galio-framework";

import { navigate } from "../../../navigations/navigationRef";
import LocationHome from "../Location/LocationHome";
import { useStore } from "../../../store/store";
import { useShallow } from "zustand/react/shallow";
import DiscoverInterest from "./DiscoverInterest";
import MapperView from "../../../components/feature/MapperView";
import RecentUsers from "../../../components/Match/RecentUsers";
import { usePushNotification } from "../../../context/PushNotification";

const DiscoveryScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [location, setLocation] = useState(null);
  const [currentUser, matches] = useStore(
    useShallow((state) => [state.currentUser, state.matches])
  );
  const { token } = usePushNotification();
  const navigateToDiscoverByInterest = () => {
    navigate({ name: "DiscoveryInterest" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <View style={styles.icons}>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => navigate({ name: "Search" })}
          >
            <Icon name="search" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <RecentUsers />

        {/* Interests View */}
        <View style={styles.interestHeaderContainer}>
          <Text bold>Interests</Text>
          <TouchableOpacity onPress={navigateToDiscoverByInterest}>
            <Text>View all</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: "100%" }}>
          <DiscoverInterest />
        </View>

        {/* Map View */}
        {/* <View style={styles.interestHeaderContainer}>
          <Text bold>People around you</Text>
        </View>
        <MapperView /> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  icons: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 15,
  },
  imageScrollView: {
    marginBottom: 10,
  },

  image: {
    width: 100,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
  },

  imageContainer: {
    marginRight: 10,
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "red",
    padding: 5,
  },

  badgeText: {
    color: "white",
    fontWeight: "bold",
  },

  overlay: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  overlayText: {
    color: "white",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 5,
    marginBottom: 2,
  },

  interestHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // this is the key prop here
    alignItems: "center",
    justifyContent: "flex-start",
  },

  interestButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 6,
    padding: 8,
    borderRadius: 30,
  },

  interestButtonSelected: {
    backgroundColor: "#FF355E",
    alignItems: "center",
    color: "white",
  },

  interestLabel: {
    color: "#000",
    marginLeft: 5,
    fontWeight: "bold",
  },

  interestLabelSelected: {
    color: "#fff",
    fontStyle: "bold",
    marginLeft: 5,
    fontWeight: "bold",
  },

  markerContainer: {
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 50,
    borderColor: "red",
  },
  markerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  markerCaption: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -10 }],
    fontWeight: "bold",
  },
});

export default DiscoveryScreen;
