import React from "react";
import { Image, StyleSheet, View } from "react-native";

export function Logo() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../Images/Logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 110,
    height: 48,
  },
});

