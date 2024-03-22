/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import React, { useState } from "react";
import {
  Text as DefaultText,
  useColorScheme,
  View as DefaultView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import Colors from "./Colors";

export function useThemeColor(
  props,
  colorName,
  inverse = false // Default value for inverse
) {
  const theme = useColorScheme() ?? "light";
  const targetTheme = inverse ? (theme === "light" ? "dark" : "light") : theme;
  const colorFromProps = props[targetTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[targetTheme][colorName];
  }
}

export function Text(props) {
  const { style, lightColor, darkColor, inverse, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text",
    inverse
  );

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props) {
  const { style, lightColor, darkColor, inverse, ...otherProps } = props;

  const backgroundColor = useThemeColor(
    {
      light: inverse ? darkColor : lightColor,
      dark: inverse ? lightColor : darkColor,
    },
    "background",
    inverse
  );

  return (
    <DefaultView
      style={[
        {
          backgroundColor,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        },
        style,
      ]}
      {...otherProps}
    >
      {otherProps.children}
    </DefaultView>
  );
}

export function CustomTextInput(props) {
  const theme = useColorScheme() ?? "light";
  return (
    <TextInput
      cursorColor={Colors.light.acccent}
      placeholder={props.placeholder}
      keyboardType={props.keyboardType}
      value={props.value}
      onChangeText={props.onChange}
      style={{
        backgroundColor: Colors[theme].tint,
        padding: 10,
        borderRadius: 10,
        ...props.style,
      }}
    />
  );
}

export function CustomButton(props) {
  const { style, lightColor, darkColor, onPress, ...otherProps } = props;

  const backgroundColor = useThemeColor(
    {
      light: otherProps.inverse ? darkColor : lightColor,
      dark: otherProps.inverse ? lightColor : darkColor,
    },
    "background"
  );

  const randomWidth = useSharedValue(0);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${randomWidth.value}%`,
    };
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handlePress = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 7000);
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isLoading ? Colors.secondary : Colors.acccent,
          width: "80%",
          justifyContent: "center",
        },
        style,
      ]}
      onPress={handlePress}
      disabled={isLoading} // Disable button while loading
      {...otherProps}
    >
      <Animated.View style={[styles.animatedButton, animatedStyle]} />
      {isLoading ? (
        <DefaultView
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="small" color={Colors.light.text} />
        </DefaultView>
      ) : (
        <DefaultView
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "600",
              color: Colors.light.text,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            {otherProps.title}
          </Text>
          <DefaultView style={{ position: "absolute", right: 10 }}>
            {otherProps.endIcon}
          </DefaultView>
        </DefaultView>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    overflow: "hidden",
  },
  animatedButton: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
  },
});
