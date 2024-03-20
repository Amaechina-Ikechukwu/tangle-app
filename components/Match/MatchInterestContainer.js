import React from "react";
import { View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Button, Text } from "galio-framework";
import { navigate } from "../../navigations/navigationRef";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";

const MatchInterestContainer = ({ interests, goToChat, user }) => {
  const handleProfileViewBtn = () => {
    navigate("ProfileDetailsScreen");
  };

  return (
    <View style={styles.container}>
      {/* Other details of the match here */}
      <Text style={styles.cardTitle}>Interests</Text>
      <View style={styles.interestsContainer}>
        {interests.map((interest) => (
          <View key={interest.id} style={styles.interestButton}>
            {/* <Icon name={interest.icon} size={24} color={"black"} /> */}
            <Text bold>{interest}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.interestDetailContainer}>
        You have {interests.length} things in common with {user.fullName}. Let’s
        start by talking about things you both like!
      </Text>

      <View style={styles.InterestButtonContainer}>
        <Button
          shadowless
          round
          color="#f91545"
          style={styles.button}
          onPress={() => goToChat()}
        >
          <Text bold color="white">
            Let's Talk
          </Text>
        </Button>
        <Button
          onPress={handleProfileViewBtn}
          shadowless
          round
          color="grey"
          style={styles.button}
        >
          <Text bold color="black">
            View Profile
          </Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 8,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  interestButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    borderRadius: 30,
  },
  interestLabel: {
    color: "#000",
    marginLeft: 1,
    fontWeight: "bold",
  },
  interestDetailContainer: {
    fontSize: 16,
    padding: 8,
  },
  InterestButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10, // optional: add some vertical margin for spacing
  },
  button: {
    width: "80%",
    height: 50,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MatchInterestContainer;
