import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { HamburgerMenu } from "./src/components/Hamburger";
import { Logo } from "./src/components/Logo";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <SafeAreaProvider>
      {showWelcome ? (
        <WelcomeScreen onContinue={() => setShowWelcome(false)} />
      ) : (
        <View style={styles.appContainer}>
          <View style={styles.topBar}>
            <View style={styles.menuWrapper}>
              <HamburgerMenu />
            </View>
            <View style={styles.logoWrapper}>
              <Logo />
            </View>
          </View>

          <View style={styles.content}>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </View>
        </View>
      )}

      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
    backgroundColor: "#fff",
    zIndex: 1000,
    overflow: "visible",
  },
  menuWrapper: {
    width: 50,
    alignItems: "flex-start",
    justifyContent: "center",
    zIndex: 1001,
  },
  logoWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
});