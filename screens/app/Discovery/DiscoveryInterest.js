import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // You can use any other icon library too
import { GeneralGet } from "../../../apis/Get/General";
import ActivityLoader from "../../../utils/ActivityLoader";
import { auth } from "../../../firebase";
import { navigate } from "../../../navigations/navigationRef";

const colors = [
  "#4ade80",
  "#60a5fa",
  "#fb7185",
  "#d946ef",
  "#a78bfa",
  "#38bdf8",
  "#facc15",
  "#22d3ee",
];
const hexToRGBA = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
const generateRandomNumbers = () => {
  let number = 0;
  number = Math.floor(Math.random() * (8 - 0 + 1)) + 0;
  if (number > 6) {
    return generateRandomNumbers();
  }
  return number;
};
const listInterests = [
  {
    id: 1,
    label: "Travelling",
    picture:
      "https://images.pexels.com/photos/1252500/pexels-photo-1252500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 1.5,
    label: "Traveling",
    picture:
      "https://images.pexels.com/photos/1252500/pexels-photo-1252500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 2,
    label: "Movies",
    picture:
      "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 3,
    label: "Music",
    picture:
      "https://images.pexels.com/photos/1876279/pexels-photo-1876279.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 4,
    label: "Foodie",
    picture:
      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 5,
    label: "Outdoor Activities",
    picture:
      "https://images.pexels.com/photos/9508460/pexels-photo-9508460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 6,
    label: "Sports",
    picture:
      "https://images.pexels.com/photos/61135/pexels-photo-61135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 7,
    label: "Cooking",
    picture:
      "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 8,
    label: "Reading",
    picture:
      "https://images.pexels.com/photos/1031588/pexels-photo-1031588.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 9,
    label: "Art and Culture",
    picture:
      "https://images.pexels.com/photos/6424244/pexels-photo-6424244.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 9.5,
    label: "Art & Culture",
    picture:
      "https://images.pexels.com/photos/6424244/pexels-photo-6424244.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 10,
    label: "Gaming",
    picture:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 11,
    label: "Fitness",
    picture:
      "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 12,
    label: "Dancing",
    picture:
      "https://images.pexels.com/photos/5152595/pexels-photo-5152595.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  // Add more interests as necessary...
];

const DiscoveryInterest = () => {
  const [count, setCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const numberOfInterest = async () => {
    try {
      const interests = {};
      await Promise.all(
        listInterests.map(async (interest) => {
          const { result } = await GeneralGet(
            `interests/interestuserscount?interest=${interest.label}`,
            auth?.currentUser?.uid
          );
          interests[interest.label] = result;
        })
      );

      setCount(interests);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching interest counts:", error);
    }
  };
  const sortByPopular = () => {
    const newData = listInterests.sort(
      (a, b) => count[b.label] - count[a.label]
    );
    setData(newData);
  };
  useEffect(() => {
    setData(listInterests);
    numberOfInterest();
  }, []);
  useEffect(() => {}, [data]);
  const InterestItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigate({ name: "InterestUsers", params: { interest: item.label } })
      }
      style={styles.listItem}
    >
      <ImageBackground
        source={{ uri: item.picture }}
        imageStyle={{ borderRadius: 20 }}
      >
        <View
          style={[
            {
              width: 70,
              height: 70,
              borderRadius: 20,
              backgroundColor: hexToRGBA(colors[generateRandomNumbers()], 0.6),
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        />
      </ImageBackground>
      <View style={styles.textContainer}>
        <Text style={styles.interestName}>{item.label}</Text>
        <Text style={styles.count}>{count[item.label]} people</Text>
      </View>
      <Ionicons name="arrow-forward" size={24} color="grey" />
    </TouchableOpacity>
  );
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityLoader
          loadingFor={"Discover Interest"}
          data={count}
          reloadFunction={() => numberOfInterest()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover by Interest</Text>
        <TouchableOpacity onPress={() => sortByPopular()}>
          <Text style={styles.sortOption}>Popular</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
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
    gap: 10,
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
