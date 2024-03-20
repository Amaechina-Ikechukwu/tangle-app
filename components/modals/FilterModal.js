import React, { useState } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { Checkbox, Button, Block, Text, Switch } from 'galio-framework';
import Slider from '@react-native-community/slider';

const FilterModal = ({ isVisible, onClose }) => {
  const [makeFriends, setMakeFriends] = useState(false);
  const [dating, setDating] = useState(false);
  const [distance, setDistance] = useState(10);
  const [age, setAge] = useState(18);
  const [isOnline, setIsOnline] = useState(true);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title} b>Filters</Text>

          <Text b size={20}>Preferences</Text>
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

          <Text b size={20}>Distance: {distance} km</Text>
          
          <Slider
            value={distance}
            onValueChange={setDistance}
            maximumValue={20}
            minimumValue={0}
            step={1}
            minimumTrackTintColor="red"   // color for the track on the left of the thumb
            maximumTrackTintColor="red"
            style={{ height: 50, overflow: 'hidden', marginTop: -10 }}
            thumbStyle={{ marginTop: 10, marginBottom: 10 }}
          />

          <Text b size={20} style={styles.sliderLabel}>Age: {age} years old</Text>
          <Slider
            minimumValue={18}
            maximumValue={100}
            step={1}
            value={age}
            onValueChange={setAge}
            minimumTrackTintColor="red"   // color for the track on the left of the thumb
            maximumTrackTintColor="red"
            trackStyle={{ height: 10 }} // Adjust track thickness
            style={{ height: 40 }} // Adjust overall height
          />

          <View style={styles.onlineRow}>
            <Text style={styles.onlineLabel}>Online Now</Text>
            <Switch value={isOnline} onValueChange={setIsOnline} />
          </View>

          <View style={styles.buttonRow}>
            <Button shadowless round color="lightgrey" onPress={onClose}>Reset</Button>
            <Button shadowless round>Apply</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 42,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    width: '100%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    paddingBottom: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    margin: 8,
  },
  sliderLabel: {
    marginVertical: 10,
  },
  onlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  onlineLabel: {
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default FilterModal;
