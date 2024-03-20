import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NavBar = ({ onFilterPress }) => {
  return (
    <View style={styles.navBar}>
      <Text style={styles.title}>Matches</Text>
      <TouchableOpacity onPress={onFilterPress} style={styles.iconContainer}>
        <Icon name="filter" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row', // To layout the title and the icon horizontally
    alignItems: 'center',
    justifyContent: 'space-between', // To push the title and icon to opposite ends
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconContainer: {
    padding: 5, // For easier pressing of the icon
  },
});

export default NavBar;
