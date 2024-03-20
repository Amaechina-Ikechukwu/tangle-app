import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import NavBar from "../../components/Match/Navbar";
import { navigate } from "../../navigations/navigationRef";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";
import Colors from "../../Colors";
import ActivityLoader from "../../utils/ActivityLoader";
import { auth } from "../../firebase";
import { GetMatches } from "../../services/Matches/api";
import { CustomButton } from "../../Themed";

const MatchScreen = () => {
  const [matches, setMatches] = useStore(
    useShallow((state) => [state.matches, state.setMatches])
  );
  // Sample data
  const likes = 120;
  const comments = 45;
  const userImages = [
    require("../../assets/images/onboarding/face_1.jpg"),
    require("../../assets/images/onboarding/face_1.jpg"),
    // ... more user images
  ];

  // Sample data
  const users = [
    {
      id: "1",
      image: require("../../assets/images/onboarding/face_1.jpg"),
      name: "Bob",
      age: 28,
      online: true,
      distance: "3 km",
      country: "NYC",
    },
    {
      id: "2",
      image: require("../../assets/images/onboarding/face_2.jpg"),
      name: "Alice",
      age: 25,
      online: false,
      distance: "5 km",
      country: "Jamaica",
    },
    {
      id: "3",
      image: require("../../assets/images/onboarding/face_3.jpg"),
      name: "Charlie",
      age: 30,
      online: true,
      distance: "2 km",
      country: "Canada",
    },
    {
      id: "4",
      image: require("../../assets/images/onboarding/face_4.jpg"),
      name: "Kevin",
      age: 27,
      online: false,
      distance: "7 km",
      country: "English",
    },
  ];
  const reload = async () => {
    const { result } = await GetMatches({ token: auth.currentUser.uid });
    setMatches(result);
  };
  const handleFilterPress = () => {};

  const handleMatchPress = ({ user }) => {
    navigate({ name: "MatchDetails", params: { user } });
  };

  return (
    <>
      <NavBar onFilterPress={handleFilterPress} />
      <View style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Ionicons
                style={styles.icon}
                name="heart"
                size={30}
                color="#fff"
              />
            </View>
            <Text style={styles.iconText}> Likes 20</Text>
          </View>

          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Ionicons name="chatbubble" size={30} color="#fff" />
            </View>
            <Text style={styles.iconText}> Connect 50</Text>
          </View>
        </View>

        <Text style={styles.title}>
          Your Matches {matches ? matches.length : 0}
        </Text>

        <FlatList
          ListEmptyComponent={
            <ActivityLoader
              loadingFor={"Matches"}
              data={matches}
              reloadFunction={reload}
            />
          }
          data={matches}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userContainer}
              onPress={() => handleMatchPress({ user: item })}
            >
              <Image source={{ uri: item.imageurl }} style={styles.userImage} />
              <View style={styles.overlay}>
                <View style={styles.distanceContainer}>
                  <Text style={styles.distance}> 3 km </Text>
                </View>
                <View style={styles.userInfoContainer}>
                  <Text style={styles.userInfo}>
                    {item.fullName.split(" ")[0]}, {item.age}
                  </Text>
                  <View
                    style={[
                      styles.onlineDot,
                      item.gender == "male" ? styles.online : styles.offline,
                    ]}
                  />
                </View>
                <View style={styles.countryContainer}>
                  <Text style={styles.country}> Nigeria </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.userId}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  iconContainer: {
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: "lightgray",
    borderRadius: 100,
    padding: 20,
    marginRight: 20,
    borderWidth: 1,
    borderColor: "red",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  iconText: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
  },
  usersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  userImage: {
    width: 80,
    height: 70,
    borderRadius: 35,
    margin: 5,
  },

  row: {
    flex: 1,
    justifyContent: "space-around",
  },
  userContainer: {
    borderWidth: 5,
    borderColor: "#FF355E",
    borderRadius: 25,
    flex: 1,
    alignItems: "center",
    margin: 5,
  },

  userImage: {
    borderRadius: 25,
    width: 160,
    height: 240,
  },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 20,
    right: 0,
    justifyContent: "flex-end", // Align children at the bottom
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // darkens the image
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 8,
    marginBottom: 20,
  },

  distance: {
    color: "white",
    fontSize: 16,
    marginHorizontal: 5,
  },

  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    marginBottom: 20,
  },
  online: {
    backgroundColor: "green",
  },
  offline: {
    backgroundColor: "red",
  },

  distanceContainer: {
    borderRadius: 20,
    padding: 5,
    backgroundColor: "grey",
    flexDirection: "row",
    alignItems: "center",
  },

  countryContainer: {
    backgroundColor: "grey",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  country: {
    color: "white",
  },
});

export default MatchScreen;
