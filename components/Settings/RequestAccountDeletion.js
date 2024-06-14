import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../Colors";
import { Checkbox } from "react-native-paper";
import { CustomTextInput } from "../../Themed";
import { GeneralPost } from "../../apis/Post/General";
import { auth } from "../../firebase";
import { useNotification } from "../../context/Notifications";
const { height } = Dimensions.get("screen");
const PickReasons = ({ data, setReasons, reasons }) => {
  return (
    <View style={{ height: height * 0.5, width: "100%" }}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.innerCheckboxView}>
              <Checkbox
                color={Colors.light.acccent}
                status={reasons.includes(item) ? "checked" : "unchecked"}
                onPress={() => {
                  setReasons(item);
                }}
              />
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {item}
              </Text>
            </View>
          );
        }}
        keyExtractor={(index) => index.toString()}
      />
    </View>
  );
};
export default function RequestAccountDeletion({ navigation }) {
  const [reasons, setReasons] = useState([]);
  const [petition, setPetition] = useState("");
  const [disabled, setDisable] = useState(false);
  const { showNotification } = useNotification();
  const reasonsToDeleteDatingAccount = [
    "Found a meaningful connection offline",
    "No longer interested in dating",
    "Too busy with work or personal life",
    "Met someone special and want to focus on that relationship",
    "Prefer meeting people in person",
    "Taking a break from dating",
    "Realized dating apps are negatively impacting mental health",
    "Changed relationship goals or priorities",
    "Found other ways to meet people that are more fulfilling",
    "Wants to maintain a more private or low-profile online presence",
    "Concerns about addiction or over-dependence on dating apps",
    "Simply not enjoying the experience anymore",
  ];
  const pickReasons = ({ reason }) => {
    setReasons((prev) => [...prev, reason]);
  };
  const submitRequest = async () => {
    try {
      showNotification(`Submitting Request , please wait...`);
      const body = {
        reasons,
        petition,
      };

      await GeneralPost(
        "accounts/requestdeletion",
        auth?.currentUser?.uid,
        body
      );
      showNotification(`Request Submitted`);
      navigation.goBack();
    } catch (error) {
      showNotification(` Error Submitting Request ...`);
    }
  };
  useEffect(() => {
    if (reasons.length === 0) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [reasons, petition]);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>
        Please, let us know the reason for this action
      </Text>
      <PickReasons
        data={reasonsToDeleteDatingAccount}
        reasons={reasons}
        setReasons={(reason) => pickReasons({ reason })}
      />
      <CustomTextInput
        value={petition}
        onChange={(text) => setPetition(text)}
        style={{ width: "100%", height: 70 }}
        placeholder="Please tell us what we can do"
        multiline={true}
      />
      <TouchableOpacity
        style={styles.button}
        disabled={disabled}
        onPress={() => submitRequest()}
      >
        <Text style={{ color: "white" }}>Submit Request</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 20,
    height: "100%",
  },
  innerCheckboxView: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  button: {
    backgroundColor: Colors.light.acccent,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 10,
  },
});
