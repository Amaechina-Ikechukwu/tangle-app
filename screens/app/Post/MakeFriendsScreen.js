import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  View,
  Text,
  PermissionsAndroid,
} from "react-native";
import { useStore } from "../../../store/store";
import { useShallow } from "zustand/react/shallow";
import { GetPosts } from "../../../services/Posts/api";
import { auth } from "../../../firebase";
import DatingProfileCard from "../../../components/feature/DatingProfileCard";
import ActivityLoader from "../../../utils/ActivityLoader";
import CustomNavbar from "../../../components/CustomNavbar";
import CreatePost from "../../../components/Home/CreatePost";
import Stories from "../../../components/Home/Stories";
import { useNavigation } from "@react-navigation/native";
import { useNotification } from "../../../context/Notifications";
const Header = () => {
  return (
    <View style={{ gap: 5 }}>
      <CustomNavbar />
      <Stories />
    </View>
  );
};

const MakeFriendsScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts, currentUser, settings] = useStore(
    useShallow((state) => [
      state.posts,
      state.setPosts,
      state.currentUser,
      state.settings,
    ])
  );
  const { showNotification } = useNotification();
  const [refreshing, setRefreshing] = useState(false);
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await getPosts();
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      showNotification("Could not retrieve posts at the moment");
    } finally {
      setRefreshing(false);
    }
  };

  const getPosts = async () => {
    try {
      const posts = await GetPosts({ token: auth?.currentUser.uid });
      setPosts(posts);
    } catch (error) {
      console.error("Error getting posts:", error);
    }
  };

  useEffect(() => {}, [posts]);

  return (
    <View>
      <FlatList
        style={styles.container}
        ListHeaderComponent={<Header />}
        initialNumToRender={5}
        ListHeaderComponentStyle={{ marginBottom: 5 }}
        data={posts}
        renderItem={({ item, index }) => (
          <DatingProfileCard
            item={item}
            navigation={navigation}
            index={index}
            currentUser={currentUser}
          />
        )}
        keyExtractor={(item) => item.postid}
        ListEmptyComponent={
          <ActivityLoader
            loadingFor={"Posts"}
            data={posts}
            reloadFunction={() => getPosts()}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF", "red"]} // Customize the loading spinner color(s)
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 75 },
});

export default MakeFriendsScreen;
