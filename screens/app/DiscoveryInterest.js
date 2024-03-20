import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // You can use any other icon library too

const interests = [
  { id: "1", name: "Photography", count: 1234 },
  { id: "2", name: "Hiking", count: 567 },
  { id: "3", name: "Music", count: 892 },
  { id: "4", name: "Music", count: 892 },
  // ... add more interests here
];

const InterestItem = ({ item }) => (
  <TouchableOpacity style={styles.listItem}>
    <Image source={item.avatar} style={styles.avatar} />
    <View style={styles.textContainer}>
      <Text style={styles.interestName}>{item.name}</Text>
      <Text style={styles.count}>{item.count} people</Text>
    </View>
    <Ionicons name="arrow-forward" size={24} color="grey" />
  </TouchableOpacity>
);

const DiscoveryInterest = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover by Interest</Text>
        <TouchableOpacity>
          <Text style={styles.sortOption}>Popular</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={interests}
        renderItem={InterestItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sortOption: {
    fontSize: 16,
    color: "blue",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  interestName: {
    fontSize: 18,
  },
  count: {
    color: "grey",
  },
});

export default DiscoveryInterest;
