import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GeneralGet } from "../../apis/Get/General";
import { auth } from "../../firebase";
import { navigate } from "../../navigations/navigationRef";

export default function RecentUsers() {
  const [recentUsers, setRecentUsers] = useState();
  const getRecentUsers = async () => {
    const { result } = await GeneralGet(
      "profile/recentlyjoined",
      auth?.currentUser?.uid
    );

    setRecentUsers(result);
  };
  useEffect(() => {
    getRecentUsers();
  }, []);
  const renderItem = ({ item }) => {
    if (item.fullName) {
      return (
        <TouchableOpacity
          onPress={() =>
            navigate({
              name: "ProfileDetailsScreen",
              params: { uid: item?.userKey },
            })
          }
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.imageurl }} style={styles.image} />
            {item.daysDifference < 14 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>New</Text>
              </View>
            )}
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>
                {item?.fullName.split(" ")[0]}, {item?.location?.countryCode}
              </Text>
              <Text style={styles.overlayText}>{item.age}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  if (!recentUsers) {
    return null;
  }
  return (
    <View>
      <FlatList
        data={recentUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.userKey}
        horizontal
        contentContainerStyle={{ gap: 10 }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
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
});
