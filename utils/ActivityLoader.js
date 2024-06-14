import React, { useState, useEffect } from "react";
import { ActivityIndicator, Image, ScrollView, View } from "react-native";
import { CustomButton, Text } from "../Themed";
import Colors from "../Colors";
export const NewSignIn = () => {
  return (
    <>
      <Image
        style={{ width: "90%", height: 300, borderRadius: 20 }}
        source={require("../assets/images/onboarding/Create.png")}
      />
      <Image
        style={{ width: "90%", height: 300, borderRadius: 20 }}
        source={require("../assets/images/onboarding/Connect.png")}
      />
    </>
  );
};
const ActivityLoader = ({ reloadFunction, loadingFor, data }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setError(true);
    }, 9000);

    // Clear the timer if component unmounts or reloadFunction changes
    return () => clearTimeout(timer);
  }, []);

  const reload = () => {
    // setLoading(true);
    // setError(false);
    reloadFunction();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, height: "100%" }}>
        <ActivityIndicator size="large" color={Colors.light.acccent} />
      </View>
    );
  }

  if (data == null) {
    return (
      <View
        style={{
          height: "100%",
          gap: 10,
          alignItems: "center",
          padding: 20,
        }}
      >
        {loadingFor == "Posts" ? (
          <>
            <Image
              style={{ width: "100%", height: 300, borderRadius: 20 }}
              source={require("../assets/images/onboarding/Create.png")}
            />
            <Image
              style={{ width: "100%", height: 300, borderRadius: 20 }}
              source={require("../assets/images/onboarding/Connect.png")}
            />
          </>
        ) : (
          <>
            <Text>Error loading {loadingFor}.</Text>
            <CustomButton title="Reload" onPress={reload} />
          </>
        )}
      </View>
    );
  }
  if (data.length == 0) {
    return (
      <View
        style={{
          height: "100%",
          gap: 10,
          alignItems: "center",
        }}
      >
        {loadingFor == "Posts" ? (
          <NewSignIn />
        ) : (
          <Text>{`No ${loadingFor}.`}</Text>
        )}
      </View>
    );
  }

  return <View style={{ flex: 1, height: "100%" }}></View>;
};

export default ActivityLoader;
