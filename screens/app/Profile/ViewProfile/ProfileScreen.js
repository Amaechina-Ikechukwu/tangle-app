import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import customMapStyle from "../../../../utils/mapstyle.json";

import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "galio-framework";
import MapView, { Marker } from "react-native-maps";

const ProfileScreen = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const renderImageItem = (source, name, location, age, isNew) => (
    <View style={styles.imageContainer}>
      <Image source={source} style={styles.image} />
      {isNew && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>New</Text>
        </View>
      )}
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>
          {name}, {location}
        </Text>
        <Text style={styles.overlayText}>{age}</Text>
      </View>
    </View>
  );

  const interests = [
    { id: 1, label: "Dancing", icon: "body" },
    { id: 2, label: "Gaming", icon: "game-controller-outline" },
    { id: 3, label: "Movie", icon: "film-outline" },
    { id: 4, label: "Language", icon: "language-outline" },
    { id: 5, label: "Fashion", icon: "shirt-outline" },
    { id: 6, label: "Writing", icon: "create-outline" },
    // { id: 7, label: 'Painting', icon: 'brush-outline' },
    // { id: 8, label: 'Football', icon: 'football-outline' },
    // { id: 9, label: 'People', icon: 'people-outline' },
    // { id: 10, label: 'Gym & Fitness', icon: 'fitness-outline' },
    // { id: 11, label: 'Animal', icon: 'paw-outline' },
    // { id: 12, label: 'Nature', icon: 'leaf-outline' },
    // Add more interests as necessary...
  ];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => prev.filter((i) => i !== interest));
    } else {
      setSelectedInterests((prev) => [...prev, interest]);
    }
  };

  const nearbyUsers = [
    {
      id: "1",
      latitude: 37.785834,
      longitude: -122.406417,
      image: require("../../assets/images/onboarding/face_1.jpg"),
    },
    {
      id: "2",
      latitude: 37.79225,
      longitude: -122.4344,
      image: require("../../assets/images/onboarding/face_2.jpg"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <View style={styles.icons}>
          <TouchableOpacity style={styles.icon}>
            <Icon name="search" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <Icon name="filter" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Rest of the view content */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.imageScrollView}
      >
        {renderImageItem(
          require("../../assets/images/onboarding/face_1.jpg"),
          "Charlie",
          "Dallas",
          "35",
          true
        )}
        {renderImageItem(
          require("../../assets/images/onboarding/face_2.jpg"),
          "Alice",
          "Chicago",
          "28",
          true
        )}
        {renderImageItem(
          require("../../assets/images/onboarding/face_3.jpg"),
          "Jamie",
          "NYC",
          "22",
          false
        )}
      </ScrollView>
      {/* End off Recommended matches */}

      {/* Interest View */}
      <ScrollView>
        <View style={styles.interestHeaderContainer}>
          <Text bold>Interests</Text>
          <Text>View all</Text>
        </View>

        <View style={styles.interestsContainer}>
          {interests.map((interest) => (
            <TouchableOpacity
              key={interest.id}
              style={[
                styles.interestButton,
                selectedInterests.includes(interest.id) &&
                  styles.interestButtonSelected,
              ]}
              onPress={() => toggleInterest(interest.id)}
            >
              <Icon
                name={interest.icon}
                size={24}
                color={
                  selectedInterests.includes(interest.id) ? "white" : "black"
                }
              />
              <Text
                bold
                style={[
                  styles.interestLabel,
                  selectedInterests.includes(interest.id) &&
                    styles.interestLabelSelected,
                ]}
              >
                {interest.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Map View */}
        <View style={styles.interestHeaderContainer}>
          <Text bold>People around you</Text>
        </View>

        <MapView
          customMapStyle={customMapStyle}
          style={{ height: 400, borderRadius: 20 }}
          initialRegion={{
            latitude: 37.785834,
            longitude: -122.406417,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {nearbyUsers.map((user) => (
            <Marker
              key={user.id}
              coordinate={{
                latitude: user.latitude,
                longitude: user.longitude,
              }}
            >
              <View style={styles.markerContainer}>
                <Image source={user.image} style={styles.markerImage} />
                {/* <Text style={styles.markerCaption}>John Doe</Text> */}
              </View>
            </Marker>
          ))}
        </MapView>
        {/* End of map view */}
      </ScrollView>
      {/* End Interest View */}
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

export default ProfileScreen;
