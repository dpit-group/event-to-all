import React from "react";
import { Image, StyleSheet, View } from "react-native";

export function Logo() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../resources/Logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems:"flex-end",
    justifyContent: "flex-end"
    
  },
  logo: {
    width: 110,
    height: 48,
  },
});

