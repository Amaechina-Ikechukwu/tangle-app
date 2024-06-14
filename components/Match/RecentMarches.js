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
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";
import emptyimagestring from "../../utils/emptyimagestring";
import { navigate } from "../../navigations/navigationRef";

export default function RecentMatches() {
  const [recentMatches, setRecentMatches] = useState();
  const [matches] = useStore(useShallow((state) => [state.matches]));
  const getRecentMatches = async () => {
    let newmatches = [];
    matches.forEach((match) => {
      if (
        match?.matchPercentage !== null ||
        match?.matchPercentage !== undefined
      ) {
        if (match?.matchPercentage > 60) {
          newmatches.push(match);
        }
      }
    });
    newmatches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    setRecentMatches(newmatches);
  };
  useEffect(() => {
    getRecentMatches();
  }, []);
  const renderItem = ({ item }) => {
    if (item.fullName) {
      return (
        <TouchableOpacity
          onPress={() =>
            navigate({
              name: "ProfileDetailsScreen",
              params: { uid: item?.userId },
            })
          }
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.imageurl || emptyimagestring }}
              style={styles.image}
            />

            <View style={styles.overlay}>
              <Text style={styles.overlayText}>
                {item.fullName}, {item?.location?.countryName}
              </Text>
              <Text style={styles.overlayText}>{item.age}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  if (!matches || !recentMatches) {
    return null;
  }
  return (
    <View>
      <FlatList
        data={recentMatches}
        renderItem={renderItem}
        keyExtractor={(item) => item.userId}
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
