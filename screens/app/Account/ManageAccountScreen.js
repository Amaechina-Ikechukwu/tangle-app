import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Avatar, Icon, ListItem } from "react-native-elements";
import avatar from "../../../assets/images/avatar.png";
import { useStore } from "../../../store/store";
import { useShallow } from "zustand/react/shallow";

const ManageAccountScreen = ({ navigation }) => {
  // State for the switches
  const [isEmailEnabled, setEmailEnabled] = React.useState(false);
  const [currentUser] = useStore(useShallow((state) => [state.currentUser]));
  const toggleEmail = () => setEmailEnabled((previousState) => !previousState);
  // const toggleDarkMode = () => setDarkModeEnabled(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Avatar
            size="large"
            rounded
            source={{ uri: currentUser?.imageurl }}
            containerStyle={styles.avatar}
          />

          <Text style={styles.userName}>{currentUser?.fullName}</Text>
          <Text style={styles.userHandle}>@{currentUser?.username}</Text>
        </View>

        {/* List of options */}
        <View>
          {/* Edit Profile */}
          <ListItem
            bottomDivider
            onPress={() => navigation.navigate("Edit Profile")}
          >
            <Icon name="edit" />
            <ListItem.Content>
              <ListItem.Title>Edit Profile</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>

          {/* Email */}
          <ListItem bottomDivider>
            <Icon name="mail" />
            <ListItem.Content>
              <ListItem.Title>Email</ListItem.Title>
            </ListItem.Content>
            <Text>{currentUser?.email}</Text>
          </ListItem>

          {/* Notifications */}
          <ListItem bottomDivider>
            <Icon name="notifications" />
            <ListItem.Content>
              <ListItem.Title>Notifications</ListItem.Title>
            </ListItem.Content>
            <Switch onValueChange={toggleEmail} value={isEmailEnabled} />
          </ListItem>

          {/* Location */}
          <ListItem
            bottomDivider
            onPress={() => navigation.navigate("Location Setting")}
          >
            <Icon name="place" />
            <ListItem.Content>
              <ListItem.Title>Location</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>

          {/* Account Preferences */}
          <ListItem bottomDivider>
            <Icon name="settings" />
            <ListItem.Content>
              <ListItem.Title>Account Preferences</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>

          {/* Privacy Settings */}
          <ListItem bottomDivider>
            <Icon name="lock" />
            <ListItem.Content>
              <ListItem.Title>Privacy Settings</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>

          {/* Communication */}
          <ListItem bottomDivider>
            <Icon name="message" />
            <ListItem.Content>
              <ListItem.Title>Communication</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>

          {/* Security Settings */}
          <ListItem bottomDivider>
            <Icon name="security" />
            <ListItem.Content>
              <ListItem.Title>Security Settings</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>

          {/* Subscription & Payment */}
          <ListItem bottomDivider>
            <Icon name="credit-card" />
            <ListItem.Content>
              <ListItem.Title>Subscription & Payment</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>

          {/* Help And Support */}
          <ListItem bottomDivider>
            <Icon name="help-outline" />
            <ListItem.Content>
              <ListItem.Title>Help And Support</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>

          {/* Account Action */}
          <ListItem bottomDivider>
            <Icon name="done" />
            <ListItem.Content>
              <ListItem.Title>Account Action</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>

          {/* Feedback and Suggestion */}
          <ListItem bottomDivider>
            <Icon name="feedback" />
            <ListItem.Content>
              <ListItem.Title>Feedback and Suggestion</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
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
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#FFFF",
  },
  avatar: {
    borderWidth: 2,
    borderColor: "#FFD700", // Gold color for the border
  },
  editIcon: {
    position: "absolute",
    right: 30,
    top: 50, // Adjust the position according to your design
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  userHandle: {
    color: "grey",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "lightgrey",
  },
  // Add additional styles for other elements as needed
});

export default ManageAccountScreen;
