import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = ({navigation}) => {
  const [distance, setDistance] = useState(100);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  
  const handleLocationSelect  = () => {
        alert('working')
        navigation.navigate('Select Location')
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerText}>Discovery Setting</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={handleLocationSelect}>
        <View style={styles.settingItem}>
          <Text style={styles.settingTitle}>Location</Text>
          <View style={styles.settingValue}>
            <Text>Hamburg, Germany</Text>
            <Icon name="chevron-right" siz e={25} color="grey" style={styles.icon} />
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.distanceContainer}>
        <Text style={styles.distanceTitle}>Distance Preference</Text>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={200}
            step={1}
            value={distance}
            onValueChange={value => setDistance(value)}
            minimumTrackTintColor="#FF0000"
            maximumTrackTintColor="#000000"
          />
          <Text style={styles.distanceValue}>{`${distance}km`}</Text>
        </View>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Only show people in this range</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
  },
  settingTitle: {
    fontSize: 18,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
  },
  distanceContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
  },
  distanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    flex: 1,
  },
  distanceValue: {
    fontSize: 18,
    color: 'grey',
    marginLeft: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  switchLabel: {
    fontSize: 18,
  },
});

export default SettingsScreen;
