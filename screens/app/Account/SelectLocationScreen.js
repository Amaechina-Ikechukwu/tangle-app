import React, { useState } from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Country, State, City } from 'country-state-city';

const LocationSelector = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const countries = Country.getAllCountries().map(country => ({
    label: country.name,
    value: country.isoCode
  }));

  const states = selectedCountry 
    ? State.getStatesOfCountry(selectedCountry).map(state => ({
        label: state.name,
        value: state.isoCode
      }))
    : [];

  const cities = selectedState 
    ? City.getCitiesOfState(selectedCountry, selectedState).map(city => ({
        label: city.name,
        value: city.name
      }))
    : [];

  return (
    <View>
      <Text>Select Country</Text>
      <RNPickerSelect
        onValueChange={(value) => {
          setSelectedCountry(value);
          setSelectedState(null); // Reset state when country changes
        }}
        items={countries}
      />

      <Text>Select State</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedState(value)}
        items={states}
        disabled={!selectedCountry}
      />

      <Text>Select City</Text>
      <RNPickerSelect
        onValueChange={(value) => console.log(value)}
        items={cities}
        disabled={!selectedState}
      />
    </View>
  );
};


export default LocationSelector;