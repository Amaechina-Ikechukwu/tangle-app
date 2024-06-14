import { useStripe } from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import Colors from "../../Colors";
import { useNotification } from "../../context/Notifications";
import { auth } from "../../firebase";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/react/shallow";
import { GetProfile } from "../../services/Profile/api";
import { LinearGradient } from "expo-linear-gradient";
const { height } = Dimensions.get("window");
export default function Payments({ navigation }) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [currentUser, setCurrentUser] = useStore(
    useShallow((state) => [state.currentUser, state.setCurrentUser])
  );
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const fetchPaymentSheetParams = async () => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/accounts/payment-sheet`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.currentUser.uid}`,
        },
      }
    );
    const { result } = await response.json();
    const { paymentIntent, ephemeralKey, customer } = result;
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    if (currentUser?.subscribed) {
      setLoading(false);
    } else {
      setLoading(true);
      try {
        const { paymentIntent, ephemeralKey, customer, publishableKey } =
          await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
          merchantDisplayName: "Example, Inc.",
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: paymentIntent,
          // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
          //methods that complete payment after a delay, like SEPA Debit and Sofort.
          allowsDelayedPaymentMethods: true,
          defaultBillingDetails: {
            ...currentUser,
          },
        });

        if (!error) {
          setLoading(false);
        } else {
          navigation.goBack();
          showNotification("Please check your connection and try again");
        }
      } catch {
        navigation.goBack();
        showNotification("Please check your connection and try again");
      }
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const [countdown, setCountdown] = useState({
    days: 30,
    hours: 24,
    minutes: 60,
    seconds: 60,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const remainingTime = currentUser.subscribedAt - now;

      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      setCountdown(() => ({
        days: countdown.days + days,
        hours: countdown.hours + hours,
        minutes: countdown.minutes + minutes,
        seconds: countdown.seconds + seconds,
      }));
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      showNotification("Cannot make payments at the moment");
      navigation.goBack();
    } else {
      showNotification("Success", "Your order is confirmed!");
      const { result } = await GetProfile({
        token: currentUser.userKey,
        body: { user: currentUser.userKey },
      });
      setCurrentUser(result);
      navigation.goBack();
    }
  };
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={Colors.light.acccent} />
      </View>
    );
  }
  if (currentUser?.subscribed) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <ImageBackground
          source={require("./Background.png")}
          imageStyle={{ borderRadius: 20 }}
          style={{
            width: "100%",
            height: "100%",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 40,
                color: Colors.dark.text,
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              You are a premium user ❤️❤️❤️❤️
            </Text>
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 100,
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 26,
                color: Colors.dark.text,
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {`${countdown.days} days `}
              {`${countdown.hours} hours `}
              {`${countdown.minutes} minutes `}
              {`${countdown.seconds} seconds`}
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Image
        style={{ width: "100%", height: 500, borderRadius: 20 }}
        source={require("./payment.png")}
        resizeMode="contain"
      />
      {!currentUser?.subscribed && (
        <Button
          style={{
            width: "100%",
            backgroundColor: Colors.light.acccent,
            height: 50,
            justifyContent: "center",
            color: "white",
          }}
          mode="contained"
          onPress={openPaymentSheet}
          textColor="white"
        >
          Get Premium Access Now For $10
        </Button>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
