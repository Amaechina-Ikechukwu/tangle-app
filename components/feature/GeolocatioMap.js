import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

const LocationScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const saveLocation = async () => {
    if (location) {
      try {
        const response = await axios.post('http://your-backend-api.com/location', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        console.log(response.data);
        alert('Location saved successfully!');
      } catch (error) {
        console.log(error);
        alert('Failed to save location.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Location Setting</Text>
      {location ? (
        <MapView
          style={styles.map}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={"Your Location"}
          />
        </MapView>
      ) : (
        <Text>{errorMsg ? errorMsg : 'Waiting..'}</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
        <Text style={styles.buttonText}>Refresh Location</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={saveLocation}>
        <Text style={styles.buttonText}>Save This Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '70%',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LocationScreen;