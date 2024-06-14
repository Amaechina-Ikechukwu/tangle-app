import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Avatar, Icon, ListItem } from "react-native-elements";

import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";
import { List } from "react-native-paper";
import { auth } from "../../firebase";

export default function PrivacySettings({ navigation }) {
  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);

  const [currentUser] = useStore(useShallow((state) => [state.currentUser]));

  return (
    <View>
      <View style={styles.container}>
        <ListItem
          bottomDivider
          onPress={() => navigation.navigate("Change Password")}
        >
          <Icon name="vpn-key" />
          <ListItem.Content>
            <ListItem.Title>Change Password</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          bottomDivider
          onPress={() => navigation.navigate("Blocked Users")}
        >
          <Icon name="block" />
          <ListItem.Content>
            <ListItem.Title>Blocked Users</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        {auth.currentUser.emailVerified == false && (
          <ListItem
            bottomDivider
            onPress={() => navigation.navigate("Email Verification")}
          >
            <Icon name="question-mark" />
            <ListItem.Content>
              <ListItem.Title>Request Email Verification</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
        {/* <List.Section>
          <List.Accordion
            title="Advanced (paid)"
            left={(props) => <List.Icon {...props} icon="cash" />}
            expanded={expanded}
            onPress={handlePress}
          >
            <List.Item title="First item" />
            <List.Item title="Second item" />
          </List.Accordion>
        </List.Section> */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
});
