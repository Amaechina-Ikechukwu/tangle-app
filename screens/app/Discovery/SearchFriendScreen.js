import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import Colors from "../../../Colors";
import {
  endAt,
  equalTo,
  onValue,
  orderByChild,
  orderByValue,
  query,
  ref,
  startAt,
} from "firebase/database";
import { auth, db } from "../../../firebase";
import ActivityLoader from "../../../utils/ActivityLoader";
import { navigate } from "../../../navigations/navigationRef";
import SubscriptionSuggestion from "../../../components/feature/SubscriptionSuggestion";
import { useStore } from "../../../store/store";
import { useShallow } from "zustand/react/shallow";
import { Button } from "react-native-paper";
import { useNotification } from "../../../context/Notifications";
// import Swiper from 'react-native-deck-swiper';
const FilterSearch = ({ currentUser, setSearchFilter }) => {
  if (!currentUser?.subscribed) {
    return (
      <View style={{ height: 80 }}>
        <SubscriptionSuggestion text={"get advanced search features"} />
      </View>
    );
  }
  return (
    <View style={{ gap: 3 }}>
      <Text>Sort by</Text>
      <View style={styles.filterRow}>
        <Button
          mode="contained"
          style={{ color: Colors.light.acccent }}
          onPress={() => setSearchFilter("location")}
        >
          Location
        </Button>
        <Button
          mode="contained"
          style={{ color: Colors.light.acccent }}
          onPress={() => setSearchFilter("username")}
        >
          Username
        </Button>
        <Button
          mode="contained"
          style={{ color: Colors.light.acccent }}
          onPress={() => setSearchFilter("bio")}
        >
          Bio
        </Button>
      </View>
    </View>
  );
};
const SearchInput = ({ setSearchText, searchText }) => {
  return (
    <View>
      <TextInput
        autoFocus
        cursorColor={Colors.light.acccent}
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
        placeholder="Search for a name..."
        returnKeyType="search"
        keyboardType="default"
      />
    </View>
  );
};
const SearchResultList = ({ item }) => {
  if (item) {
    return (
      <TouchableOpacity
        style={styles.messageContainer}
        onPress={() =>
          navigate({
            name: "ProfileDetailsScreen",
            params: { uid: item.userKey },
          })
        }
      >
        <View style={styles.iconContainer}>
          <Image
            source={{
              uri:
                item.imageurl ||
                "https://th.bing.com/th/id/R.5e7a4ce24712861a9ef9a3eeeebbc5e7?rik=qDUFB6EcNshmtw&pid=ImgRaw&r=0",
            }}
            style={styles.avatarImage}
          />
          <View
            style={[
              styles.onlineDot,
              item.status == "online" ? styles.online : styles.offline,
            ]}
          />
        </View>
        <View style={[styles.textContainer, { gap: 4 }]}>
          <Text style={styles.sender}>{item.fullName}</Text>
          <Text style={[styles.sender, { color: "gray" }]}>
            {"@" + item.username}
          </Text>
          <View style={styles.location}>
            <Entypo name="location-pin" size={18} color="red" />
            <Text>
              {item?.location
                ? item?.location.adminName1 + ", " + item?.location.countryName
                : "USA"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};
const SearchFriendsScreen = () => {
  const { showNotification } = useNotification();
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [currentUser] = useStore(useShallow((state) => [state.currentUser]));
  const [searchFilter, setSearchFilter] = useState("fullName");
  const filterSearchByLocation = () => {
    const usersRef = query(ref(db, "users/"));
    const searchTextRegex = new RegExp(
      searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
      "i"
    );
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();

        const usersList = Object.keys(usersData).map((key) => {
          if (key !== auth?.currentUser.uid) {
            const userData = usersData[key];

            if (
              userData.location &&
              (searchTextRegex.test(
                userData.location.adminName1.toLowerCase()
              ) ||
                searchTextRegex.test(
                  userData.location.countryName.toLowerCase()
                ))
            ) {
              return {
                userKey: key,
                ...userData,
              };
            }
          }
        });

        setSearchResult(usersList);
        return () => unsubscribe;
      } else {
        showNotification("No users found");
      }
    });
  };

  useEffect(() => {
    if (searchFilter == "location") {
      filterSearchByLocation();
      return;
    }
    const usersRef = query(
      ref(db, "users/"),
      orderByChild(searchFilter),
      startAt(searchText),
      endAt(searchText + "\uf8ff")
    );

    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        if (snapshot.key !== auth?.currentUser.uid) {
          const usersData = snapshot.val();
          const usersList = Object.keys(usersData).map((key) => {
            if (key !== auth?.currentUser.uid) {
              return {
                userKey: key,
                ...usersData[key],
              };
            }
          });

          setSearchResult(usersList);
        }
      } else {
        showNotification("No users found");
      }
    });

    return () => unsubscribe();
  }, [searchText, searchFilter]);

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", gap: 10 }}>
        <SearchInput searchText={searchText} setSearchText={setSearchText} />
        <FilterSearch
          currentUser={currentUser}
          setSearchFilter={(filter) => setSearchFilter(filter)}
        />
        <FlatList
          data={searchResult}
          style={{ height: "95%" }}
          keyExtractor={(item, index) =>
            item !== undefined ? item.userKey : index.toString()
          }
          renderItem={({ item }) => <SearchResultList item={item} />}
          ListEmptyComponent={
            <ActivityLoader data={searchResult} loadingFor={"Users"} />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 20,
    height: 50,
    width: "100%",
    backgroundColor: Colors.light.tabIconDefault,
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    width: "100vw",
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  online: {
    backgroundColor: "green",
  },
  offline: {
    backgroundColor: "red",
  },
  messageContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
    alignItems: "center",
    borderRadius: 100,
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {},
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // half of width and height to make it circular
  },
  location: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: Colors.light.tint,
    width: "auto",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  filterRow: {
    flexDirection: "row",
    gap: 20,
  },
});

export default SearchFriendsScreen;
