import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { HamburgerMenu } from "./src/components/Hamburger";
import { Logo } from "./src/components/Logo";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <SafeAreaProvider>
      <AppContent
        showWelcome={showWelcome}
        onContinue={() => setShowWelcome(false)}
      />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

function AppContent({
  showWelcome,
  onContinue,
}: {
  showWelcome: boolean;
  onContinue: () => void;
}) {
  const insets = useSafeAreaInsets();

  return showWelcome ? (
    <WelcomeScreen onContinue={onContinue} />
  ) : (
    <View style={styles.appContainer}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8, height: 48 + insets.top }]}>
        <View style={styles.menuWrapper} />
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
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
    backgroundColor: "#fff",
    zIndex: 1000,
    overflow: "visible",
  },
  menuWrapper: {
    width: 50,
    height: 24,
    alignItems: "flex-start",
    justifyContent: "center",
    zIndex: 1001,
  },
  logoWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    transform: [{ scale: 1.2 }],
    marginTop: 35,
  },
  content: {
    flex: 1,
  },
});