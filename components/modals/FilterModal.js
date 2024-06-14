import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { Checkbox, Button, Block, Text } from "galio-framework";
import Slider from "@react-native-community/slider";
import { AntDesign } from "@expo/vector-icons";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";
import ConvertToMiles from "../../utils/ConvertToMiles";
import { useNotification } from "../../context/Notifications";
import { reload } from "firebase/auth";
const FilterModal = ({ isVisible, onClose, onReload }) => {
  const [matches, setMatches, currentUser, settings, setSettings] = useStore(
    useShallow((state) => [
      state.matches,
      state.setMatches,
      state.currentUser,
      state.settings,
      state.setSettings,
    ])
  );
  const { showNotification } = useNotification();
  const [makeFriends, setMakeFriends] = useState(false);
  const [dating, setDating] = useState(false);
  const [distance, setDistance] = useState(settings?.distance || 0);
  const [age, setAge] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [strictSearch, setstrictSearch] = useState(false);
  const CoolSearch = async () => {
    if (age < 18) {
      Alert.alert("Filter Matches", "Age should be greater than 18");
    } else {
      await onReload();
      if (matches.length > 0) {
        let newMatches = [];
        for (var i = 0; i < matches.length; i++) {
          if (matches[i] !== null) {
            if (matches[i].location) {
              if (Object.keys(matches[i].location).length > 0) {
                const convertedDistance = ConvertToMiles({
                  currentuserlocation: currentUser.location,
                  matchlocation: matches[i].location,
                });

                if (
                  parseInt(matches[i].age) <= age ||
                  matches[i].status == isOnline ||
                  convertedDistance <= distance
                ) {
                  newMatches.push(matches[i]);
                }
              } else {
                return null;
              }
            }
          }
        }

        setMatches(newMatches);
        onClose();
      } else {
        Alert.alert("Please wait");
      }
    }
  };
  const StrictSearch = async () => {
    if (age < 18) {
      Alert.alert("Filter Matches", "Age should be greater than 18");
    } else {
      await onReload();
      let newMatches = [];
      for (var i = 0; i < matches.length; i++) {
        if (matches[i] !== null) {
          if (matches[i].location) {
            if (Object.keys(matches[i].location).length > 0) {
              const convertedDistance = ConvertToMiles({
                currentuserlocation: currentUser.location,
                matchlocation: matches[i].location,
              });

              if (
                parseInt(matches[i].age) <= age &&
                matches[i].status == isOnline &&
                convertedDistance <= distance
              ) {
                newMatches.push(matches[i]);
              }
            } else {
              return null;
            }
          }
        }
      }

      setMatches(newMatches);
      onClose();
    }
  };
  const filtermatches = async () => {
    strictSearch ? StrictSearch() : CoolSearch();
  };
  const onDistanceChange = (value) => {
    setDistance(value);
    setSettings("distance", value);
  };
  const Reset = () => {
    setAge(27);
    setDistance(0);
    setIsOnline(!isOnline);
    setMakeFriends(false);
    setDating(false);
    onReload();
    onClose();
    showNotification("Resetting Matches");
  };
  useEffect(() => {}, [matches]);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.title} b>
              Filters
            </Text>
            <TouchableOpacity onPress={() => onClose()}>
              <AntDesign name="close" size={18} color="black" />
            </TouchableOpacity>
          </View>

          <Text b size={20}>
            Preferences
          </Text>
          <View style={styles.preferenceRow}>
            <View style={styles.checkboxContainer}>
              <Checkbox value={makeFriends} onValueChange={setMakeFriends} />
              <Text style={styles.label}>Make Friends</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox value={dating} onValueChange={setDating} />
              <Text style={styles.label}>Dating</Text>
            </View>
          </View>

          <Text b size={20}>
            Distance: {distance} miles
          </Text>

          <Slider
            value={distance}
            onValueChange={onDistanceChange}
            maximumValue={200}
            minimumValue={0}
            step={1}
            minimumTrackTintColor="red" // color for the track on the left of the thumb
            maximumTrackTintColor="red"
            style={{ height: 50, overflow: "hidden", marginTop: -10 }}
            thumbStyle={{ marginTop: 10, marginBottom: 10 }}
          />

          <Text b size={20} style={styles.sliderLabel}>
            Age: {age} years old
          </Text>
          <Slider
            minimumValue={18}
            maximumValue={100}
            step={1}
            value={age}
            onValueChange={setAge}
            minimumTrackTintColor="red" // color for the track on the left of the thumb
            maximumTrackTintColor="red"
            trackStyle={{ height: 10 }} // Adjust track thickness
            style={{ height: 40 }} // Adjust overall height
          />

          <View style={styles.onlineRow}>
            <Text style={styles.onlineLabel}>Online Now</Text>
            <Switch
              value={isOnline}
              onValueChange={() => setIsOnline(!isOnline)}
            />
          </View>
          <View style={styles.onlineRow}>
            <Text style={styles.onlineLabel}>Enable Strict Filter</Text>
            <Switch
              value={strictSearch}
              onValueChange={() => setstrictSearch(!strictSearch)}
            />
          </View>

          <View style={styles.buttonRow}>
            <Button onPress={Reset} shadowless round color="lightgrey">
              Reset
            </Button>
            <Button onPress={filtermatches} shadowless round>
              Apply
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 42,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "100%",
    height: "70%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    paddingBottom: 45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    margin: 8,
  },
  sliderLabel: {
    marginVertical: 0,
  },
  onlineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  onlineLabel: {
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default FilterModal;
