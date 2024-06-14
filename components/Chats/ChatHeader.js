import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../firebase";
import { onValue, ref } from "firebase/database";
export default function ChatHeader({ params }) {
  const navigation = useNavigation();
  const IsOnline = ({ uid }) => {
    let status;
    const userRef = ref(db, "users/" + uid + "/status");
    onValue(userRef, (snapshot) => {
      status = snapshot.val();
    });
    return status;
  };
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProfileDetailsScreen", {
            uid: params.userId,
          })
        }
      >
        <View style={[{ alignItems: "center", flexDirection: "row", gap: 10 }]}>
          <View>
            <Image
              style={styles.profileImage}
              source={{ uri: params.imageurl }}
            />
          </View>
          <Text h6 b style={{ marginBottom: 5 }}>
            {params.fullName}
          </Text>
          <View
            style={[
              styles.onlineDot,
              IsOnline({ uid: params.userId || params.userKey }) == "online"
                ? styles.online
                : styles.offline,
            ]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 50,
  },
  online: {
    backgroundColor: "green",
  },
  offline: {
    backgroundColor: "red",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    gap: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  profileName: {
    fontWeight: "bold",
  },
  connectionInfo: {
    alignItems: "center",
    padding: 20,
    marginBottom: 15,
  },
  connectionText: {
    marginBottom: 10,
    fontStyle: "italic",
    fontSize: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderWidth: 5,
    borderColor: "#FF6347",
    borderRadius: 200,
    marginBottom: 10,
  },
  imageSubtitle: {
    fontWeight: "bold",
    fontSize: 18,
  },

  menuButtonStyle: {
    backgroundColor: "#f91545", // Blue background
    borderRadius: 10,
    paddingHorizontal: 10, // Minimal padding
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 10,
    // Small font size
    color: "#FFFFFF", // White font color
  },
});
