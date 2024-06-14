import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { GeneralGet } from "../../../apis/Get/General";
import { auth } from "../../../firebase";
import ActivityLoader from "../../../utils/ActivityLoader";
import { navigate } from "../../../navigations/navigationRef";
const { height } = Dimensions.get("window");
export default function DiscoverInterest() {
  const [count, setCount] = useState({});
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    numberOfInterest();
  }, []);

  if (loading) {
    return (
      <ActivityLoader
        loadingFor={"Discover Interest"}
        data={count}
        reloadFunction={() => numberOfInterest()}
      />
    );
  } else {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={listInterests}
        columnWrapperStyle={{
          width: "100%",
          rowGap: 20,
          justifyContent: "space-around",
          marginBottom: 10,
        }}
        style={{ height: height * 0.66 }}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigate({
                  name: "InterestUsers",
                  params: { interest: item.label },
                })
              }
            >
              <ImageBackground
                source={{ uri: item.picture }}
                imageStyle={{ borderRadius: 10 }}
              >
                <View
                  style={{
                    height: 100,
                    width: 200,
                    borderRadius: 10,
                    backgroundColor: hexToRGBA(
                      colors[generateRandomNumbers()],
                      0.6
                    ),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 20, color: "white", fontWeight: 800 }}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={{ fontSize: 16, color: "white", fontWeight: 500 }}
                  >
                    {"Over " + count[item.label] + " people"}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          );
        }}
      />
    );
  }
}
