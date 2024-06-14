import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";
import MapView, { Marker } from "react-native-maps";
import customMapStyle from "../../utils/mapstyle.json";
import { navigate } from "../../navigations/navigationRef";
export default function MapperView() {
  const [currentUser, matches] = useStore(
    useShallow((state) => [state.currentUser, state.matches])
  );
  const { width, height } = Dimensions.get("window");
  try {
    return (
      <View>
        {currentUser &&
        currentUser.location &&
        currentUser.location !== null &&
        currentUser.location !== undefined ? (
          <MapView
            initialRegion={{
              latitude: parseFloat(currentUser.location.lat),
              longitude: parseFloat(currentUser.location.lng),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(currentUser.location.lat),
                longitude: parseFloat(currentUser.location.lng),
              }}
            >
              <View style={styles.markerContainer}>
                <Image
                  source={{ uri: currentUser?.imageurl }}
                  style={styles.markerImage}
                />
              </View>
            </Marker>

            {matches.map((user) => {
              if (user?.location !== null && user?.location !== undefined) {
                return (
                  <Marker
                    key={user.userId}
                    coordinate={{
                      latitude: parseFloat(user.location.lat),
                      longitude: parseFloat(user.location.lng),
                    }}
                  >
                    <View style={styles.markerContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          navigate({
                            name: "ProfileDetailsScreen",
                            params: { uid: user?.userId },
                          })
                        }
                      >
                        <Image
                          source={{ uri: user.imageurl }}
                          style={styles.markerImage}
                        />
                      </TouchableOpacity>
                    </View>
                  </Marker>
                );
              } else {
                return null; // Return null if user location is null or undefined
              }
            })}
          </MapView>
        ) : null}
      </View>
    );
  } catch (error) {
    console.log(error);
    return null;
  }
}
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
