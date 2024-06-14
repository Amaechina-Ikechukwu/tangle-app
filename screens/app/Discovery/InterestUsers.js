import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GetMatches } from "../../../services/Matches/api";
import { auth, db } from "../../../firebase";
import { onValue, ref } from "firebase/database";
import ActivityLoader from "../../../utils/ActivityLoader";
import { navigate } from "../../../navigations/navigationRef";
import { GeneralGet } from "../../../apis/Get/General";
const HeaderComponent = ({ interest }) => {
  return <Text style={{ fontSize: 24 }}>People interested in {interest}</Text>;
};
export default function InterestUsers() {
  const { params } = useRoute();
  const [matches, setMatches] = useState();

  const reload = async () => {
    const { result } = await GeneralGet(
      `interests/interestusers?interest=${params.interest}`,
      auth.currentUser.uid
    );

    setMatches(result);
  };

  const handleMatchPress = ({ user }) => {
    navigate({ name: "MatchDetails", params: { user } });
  };
  const IsOnline = ({ uid }) => {
    let status;
    const userRef = ref(db, "users/" + uid + "/status");
    onValue(userRef, (snapshot) => {
      status = snapshot.val();
    });

    return status;
  };
  useEffect(() => {
    reload();
  }, []);
  return (
    <View style={[styles.container, { gap: 20 }]}>
      <HeaderComponent interest={params.interest} />
      <FlatList
        ListEmptyComponent={
          <View style={[styles.container, { gap: 20 }]}>
            <ActivityLoader
              loadingFor={"Matches"}
              data={matches}
              reloadFunction={reload}
            />
          </View>
        }
        data={matches}
        renderItem={({ item }) => {
          if (item !== null) {
            return (
              <TouchableOpacity
                style={styles.userContainer}
                onPress={() => handleMatchPress({ user: item })}
              >
                <Image
                  source={{
                    uri:
                      item.imageurl ||
                      "https://th.bing.com/th/id/R.5e7a4ce24712861a9ef9a3eeeebbc5e7?rik=qDUFB6EcNshmtw&pid=ImgRaw&r=0",
                  }}
                  style={styles.userImage}
                />
                <View style={styles.overlay}>
                  <View style={styles.distanceContainer}>
                    <Text style={styles.distance}> 3 miles </Text>
                  </View>
                  <View style={styles.userInfoContainer}>
                    <Text style={styles.userInfo}>
                      {item.fullName.split(" ")[0]}, {item.age}
                    </Text>
                    <View
                      style={[
                        styles.onlineDot,
                        IsOnline({ uid: item.userId }) === "online"
                          ? styles.online
                          : styles.offline,
                      ]}
                    />
                  </View>
                  <View style={styles.countryContainer}>
                    <Text style={styles.country}>
                      {item?.location
                        ? item?.location.adminName1 +
                          ", " +
                          item?.location.countryName
                        : "USA"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }
        }}
        keyExtractor={(item, index) =>
          item !== null ? item.userId : index.toString()
        }
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}
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
