import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Country, State, City } from "country-state-city";
import { useStore } from "../../../store/store";
import { useShallow } from "zustand/react/shallow";
import Colors from "../../../Colors";
import { Button } from "react-native-paper";
import { GeneralPost } from "../../../apis/Post/General";
import { useNotification } from "../../../context/Notifications";
import { navigate } from "../../../navigations/navigationRef";
import { GetMatches } from "../../../services/Matches/api";

const LocationSelector = () => {
  const [currentUser, setMatches] = useStore(
    useShallow((state) => [state.currentUser, state.setMatches])
  );
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [message, setMessage] = useState("");
  const { showNotification } = useNotification();
  const handleSelection = ({ value, label }) => {
    if (label == "country") {
      setSelectedCountry(value);
      if (value[1] !== "US") {
        setMessage(
          `Setting a country outside the "US" may reduce your chance of getting matches`
        );
      }
      return;
    }
    if (label == "state") {
      setSelectedState(value);
      return;
    }
    if (label == "city") {
      setSelectedCity(value);
      return;
    }
  };
  useEffect(() => {}, [selectedCity, selectedState, selectedCountry]);
  const countries = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: [country.name, country.isoCode],
  }));

  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry[1]).map((state) => ({
        label: state.name,
        value: [state.name, state.isoCode],
      }))
    : [];

  const cities = selectedState
    ? City.getCitiesOfState(selectedCountry[1], selectedState[1]).map(
        (city) => ({
          label: city.name,
          value: city.name,
        })
      )
    : [];
  const UpdatePreferredLocation = async () => {
    const location = {
      country: selectedCountry[0],
      state: selectedState[0],
      city: selectedCity,
    };
    try {
      await GeneralPost(
        "profile/updatepreferredlocation",
        currentUser?.userKey,
        { location }
      );
      showNotification("Your matches will be from your new location");
      const { result } = await GetMatches({ token: currentUser?.userKey });
      setMatches(result);
      setTimeout(() => {
        navigate({ name: "Manage Account" });
      }, 3000);
    } catch (err) {
      showNotification("Could not set preferred location at the moment");
      setTimeout(() => {
        navigate({ name: "Manage Account" });
      }, 3000);
    }
  };
  return (
    <View style={{ padding: 20, gap: 20 }}>
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: 20,
          borderRadius: 10,
        }}
      >
        <Text>Select Country</Text>
        <RNPickerSelect
          style={{ color: "black" }}
          onValueChange={(value) => {
            handleSelection({ value, label: "country" });
          }}
          items={countries}
        />
      </View>
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: 20,
          borderRadius: 10,
        }}
      >
        <Text>Select State</Text>
        <RNPickerSelect
          onValueChange={(value) => handleSelection({ value, label: "state" })}
          items={states}
          disabled={!selectedCountry}
        />
      </View>

      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: 20,
          borderRadius: 10,
        }}
      >
        <Text>Select City</Text>
        <RNPickerSelect
          onValueChange={(value) => handleSelection({ value, label: "city" })}
          items={cities}
          disabled={!selectedState}
        />
      </View>
      <View
        style={{
          backgroundColor: "#fecaca",
          padding: 20,
          height: 100,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "red", textAlign: "center", fontWeight: 500 }}>
          {message}
        </Text>
      </View>
      <View>
        <Button
          style={{
            width: "100%",
            backgroundColor: Colors.light.acccent,
            height: 50,
            justifyContent: "center",
          }}
          mode="contained"
          onPress={UpdatePreferredLocation}
        >
          Set Preferred Location
        </Button>
      </View>
    </View>
  );
};

export default LocationSelector;
