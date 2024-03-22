import React, { useEffect, useState } from "react";
import { View, Text, Modal, Image, TouchableOpacity } from "react-native";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";
import { FontAwesome } from "@expo/vector-icons";
import UserHeader from "./UserHeader";
import StoryView from "./StoryView";
const Dots = ({ data, currentIndex, close }) => {
  if (data) {
    return (
      <View
        style={{
          flexDirection: "row", // semi-transparent grey

          alignItems: "center",
          justifyContent: "space-between",
          position: "absolute",
          top: 0,
          zIndex: 100,
          margin: 10,
          width: "95%",
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(128, 128, 128, 0.7)",
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 20,
            padding: 10,
          }}
        >
          {data.map((d, index) => (
            <View
              key={index}
              style={{
                backgroundColor:
                  index === currentIndex ? "white" : "rgba(0,0,0, 0.7)",
                height: 10,
                width: 10,
                borderRadius: 5,
                marginHorizontal: 5,
              }}
            />
          ))}
        </View>
        <TouchableOpacity onPress={() => close()} style={{ padding: 20 }}>
          <FontAwesome name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
};
export default function StoryModal({ open, close, data }) {
  const [stories] = useStore(useShallow((state) => [state.stories]));
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigateStory = (direction) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < stories[data.author].length) {
      setCurrentIndex(newIndex);
    } else {
      close();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={open}
      style={{ flex: 1 }}
    >
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          height: "100%",
        }}
      >
        <View
          style={{
            backgroundColor: "black",
            height: "80%",
            width: "90%",
            borderRadius: 20,
          }}
        >
          <Dots
            currentIndex={currentIndex}
            data={stories[data.author]}
            close={() => close()}
          />
          <Image
            source={{ uri: stories[data.author][currentIndex].imageurl }}
            style={{ aspectRatio: 9 / 16, width: "100%" }}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={{
              position: "absolute",
              left: 0,
              height: "100%",
              width: 50,
            }}
            onPress={() => navigateStory(-1)}
          ></TouchableOpacity>

          <TouchableOpacity
            style={{
              position: "absolute",
              right: 0,
              height: "100%",
              width: 50,
            }}
            onPress={() => navigateStory(1)}
          ></TouchableOpacity>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              margin: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "90%",
              }}
            >
              <UserHeader
                item={stories[data.author][currentIndex]}
                scale={1}
                textColor={"white"}
              />
              <StoryView views={stories[data.author][currentIndex].views} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
