import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { Logo } from "./src/components/Logo";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import { AuthProvider } from "./src/context/AuthContext";
import { FavoritesProvider } from "./src/context/FavoritesContext";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [initialTab, setInitialTab] = useState<"Home" | "Map" | "Account">(
    "Home",
  );

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FavoritesProvider>
          <AppContent
            showWelcome={showWelcome}
            initialTab={initialTab}
            onContinue={() => {
              setInitialTab("Home");
              setShowWelcome(false);
            }}
            onExplore={() => {
              setInitialTab("Map");
              setShowWelcome(false);
            }}
            onLogin={() => {
              setInitialTab("Account");
              setShowWelcome(false);
            }}
          />
        </FavoritesProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

function AppContent({
  showWelcome,
  initialTab,
  onContinue,
  onExplore,
  onLogin,
}: {
  showWelcome: boolean;
  initialTab: "Home" | "Map" | "Account";
  onContinue: () => void;
  onExplore: () => void;
  onLogin: () => void;
}) {
  const insets = useSafeAreaInsets();

  return showWelcome ? (
    <WelcomeScreen
      onContinue={onContinue}
      onExplore={onExplore}
      onLogin={onLogin}
    />
  ) : (
    <View style={styles.appContainer}>
      <View
        style={[
          styles.topBar,
          { paddingTop: insets.top + 8, height: 48 + insets.top },
        ]}
      >
        <View style={styles.logoWrapper}>
          <Logo />
        </View>
      </View>
      <View style={styles.content}>
        <NavigationContainer>
          <RootNavigator initialRouteName={initialTab} />
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
    backgroundColor: "#fff",
    zIndex: 1000,
    overflow: "visible",
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
