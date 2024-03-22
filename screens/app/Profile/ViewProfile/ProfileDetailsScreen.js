import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { Card, Button } from "galio-framework";

const ProfileDetailsScreen = () => {
  const source = require("../../../../assets/images/onboarding/face_1.jpg");
  return (
    <View style={styles.container}>
      <View style={styles.imageBackgroundContainer}>
        <Image
          source={source} // or any other background image URL
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.darkOverlay} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userLocation}>New York, USA</Text>
        </View>
        <View style={styles.btnContainer}>
          <Button icon="message1" iconFamily="antdesign" round color="#cf2f74">
            Say Hello
          </Button>
          <Button
            onlyIcon
            icon="adduser"
            iconFamily="antdesign"
            color="#4B164C"
            iconColor="#fff"
            style={{ width: 45, height: 45 }}
          >
            warning
          </Button>
        </View>
      </View>

      <View style={styles.slideUpContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <Text style={styles.sectionContent}>
            Traveling, Hiking, Reading, Music, Movies, Coding
          </Text>

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionContent}>
            Hello! I'm John and I love exploring new places and meeting new
            people. Looking forward to connecting with interesting individuals!
          </Text>

          {/* Add any other sections/content here */}
        </ScrollView>
      </View>
    </View>
  );
};

const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f3f3f3',
  },
  imageBackgroundContainer: {
    height: screenHeight * 0.5,
    justifyContent: "center",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  darkOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  userInfo: {
    flex: 1,
    justifyContent: "flex-end",
    position: "relative",
    paddingBottom: 20,
  },

  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },

  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  userLocation: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginTop: 5,
  },
  slideUpContainer: {
    height: screenHeight * 0.7,
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  sectionContent: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default ProfileDetailsScreen;
