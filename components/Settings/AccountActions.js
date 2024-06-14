import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Avatar, Icon, ListItem } from "react-native-elements";
import Colors from "../../Colors";
import { ClearAllLocalData } from "../../services/Storage";
import { signOut } from "firebase/auth";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";
import { auth } from "../../firebase";
export default function AccountActions({ navigation }) {
  const [setCurrentUser] = useStore(
    useShallow((state) => [state.setCurrentUser])
  );
  const logout = async () => {
    setCurrentUser(null);
    await ClearAllLocalData();
    await signOut(auth);
  };
  return (
    <View>
      <View style={styles.container}>
        {/* <ListItem
          bottomDivider
          onPress={() => navigation.navigate("Push Token")}
        >
          <Icon name="notifications" />
          <ListItem.Content>
            <ListItem.Title>Test Push Notifications</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem> */}
        <ListItem
          bottomDivider
          onPress={() => navigation.navigate("Request Account Deletion")}
        >
          <Icon name="delete" />
          <ListItem.Content>
            <ListItem.Title>Request For Account Deletion</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem bottomDivider onPress={logout}>
          <Icon color={Colors.light.acccent} name="logout" />
          <ListItem.Content>
            <ListItem.Title style={{ color: Colors.light.acccent }}>
              Logout
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
});
