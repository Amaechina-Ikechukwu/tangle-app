import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { CustomButton, Text } from "../Themed";
import Colors from "../Colors";

const ActivityLoader = ({ reloadFunction, loadingFor, data }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setError(true);
    }, 7000);

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
        }}
      >
        <Text>Error loading {loadingFor}.</Text>
        <CustomButton title="Reload" onPress={reload} />
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
        <Text>No {loadingFor}.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, height: "100%" }}>
      <Text>Data loaded successfully!</Text>
    </View>
  );
};

export default ActivityLoader;
