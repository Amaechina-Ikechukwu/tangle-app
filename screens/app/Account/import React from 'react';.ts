import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Avatar, Icon, ListItem } from 'react-native-elements';

const SettingsScreen = () => {
  // State for the switches
  const [isEmailEnabled, setEmailEnabled] = React.useState(false);
  const [isDarkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const toggleEmail = () => setEmailEnabled(previousState => !previousState);
  const toggleDarkMode = () => setDarkModeEnabled(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Avatar
            size="large"
            rounded
            // source={{ uri: 'path-to-your-avatar-image.png' }}
            containerStyle={styles.avatar}
          />
          <Icon name="edit" size={20} containerStyle={styles.editIcon} />
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userHandle}>@john_doe</Text>
        </View>

        {/* List of options */}
        <View>
          <ListItem bottomDivider>
            <Icon name="person-outline" />
            <ListItem.Content>
              <ListItem.Title>Edit Profile</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
          {/* Repeat similar ListItem components for each setting option */}
          {/* ... */}
          
          <ListItem bottomDivider>
            <Icon name="email" />
            <ListItem.Content>
              <ListItem.Title>Email</ListItem.Title>
            </ListItem.Content>
            <Switch onValueChange={toggleEmail} value={isEmailEnabled} />
          </ListItem>
          
          <ListItem bottomDivider>
            <Icon name="dark-mode" />
            <ListItem.Content>
              <ListItem.Title>Dark Mode</ListItem.Title>
            </ListItem.Content>
            <Switch onValueChange={toggleDarkMode} value={isDarkModeEnabled} />
          </ListItem>

          {/* Add other settings options here */}
        </View>
        
        {/* Footer with icons */}
        <View style={styles.footerContainer}>
          <Icon name="search" />
          <Icon name="add" />
          <Icon name="settings" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFF',
  },
  avatar: {
    borderWidth: 2,
    borderColor: '#FFD700', // Gold color for the border
  },
  editIcon: {
    position: 'absolute',
    right: 30,
    top: 50, // Adjust the position according to your design
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userHandle: {
    color: 'grey',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: 'lightgrey',
  },
  // Add additional styles for other elements as needed
});

export default SettingsScreen;




import React, { useState } from 'react';
import { View, StyleSheet, Image, Button } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import { List, MD3Colors, Card} from 'react-native-paper';
import avatar from '../../../assets/images/avatar.png'

const ManageAccountScreen = ({navigation}) => {


  return (<>
    <View style={styles.container}>
    <Avatar
          rounded // This prop makes the avatar circular
          source={avatar}
          size="large"
          containerStyle={styles.avatarContainer}
        />
        {/* Overlay the edit icon using absolute positioning */}
        <Icon
          name='edit'
          type='material'
          color='#517fa4'
          onPress={() => console.log('Edit icon pressed')}
          containerStyle={styles.editIcon}
        />
    </View>
    <View style={styles.listContainer}>
      <List.Section>
          <List.Subheader>Account Settings</List.Subheader>
            <List.Item style={styles.shadow} title="Edit Profile" onPress={() => navigation.navigate('Edit Profile')}     left={() => <List.Icon icon="account-edit" />} />
            <List.Item style={styles.shadow} title="Location"     onPress={() => navigation.navigate('Location Setting')} left={() => <List.Icon icon="map-marker" />} />
            <List.Item style={styles.shadow} title="Account Preferences" left={() => <List.Icon icon="tune" />} />
            <List.Item style={styles.shadow} title="Privacy Settings" left={() => <List.Icon icon="lock" />} />
            <List.Item style={styles.shadow} title="Communication" left={() => <List.Icon icon="message-text" />} />
            <List.Item style={styles.shadow} title="Security Settings" left={() => <List.Icon icon="security" />} />
            <List.Item style={styles.shadow} title="Subscription & Payment" left={() => <List.Icon icon="credit-card" />} />
            <List.Item style={styles.shadow} title="Help And Support" left={() => <List.Icon icon="help-circle" />} />
            <List.Item style={styles.shadow} title="Account Action" left={() => <List.Icon icon="account-check" />} />
            <List.Item style={styles.shadow} title="Feedback and Suggestion" left={() => <List.Icon icon="comment-alert" />} />
    </List.Section>
   </View>
     </>
  );
};
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      position: 'relative', // This enables absolute positioning for children
    },

    listContainer: {
      flex: 1,
    },

    avatarContainer: {
      marginLeft: 10,
    },
    iconsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    editIcon: {
      position: 'absolute', // Position the edit icon absolutely
      bottom: -10, // Adjust this value as needed to move the icon up towards the avatar
      right: -10, // Adjust this value as needed to move the icon left towards the avatar
      backgroundColor: 'white', // Match the background or use a color that fits your design
      borderRadius: 50, // Circular background for the icon
      padding: 5, // Padding inside the background color
    },
    shadow: {
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      padding: 40,
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      backgroundColor: 'white', // Important for elevation to be visible
      marginVertical: 1, // Add space between items
    },
   
  });


export default ManageAccountScreen;