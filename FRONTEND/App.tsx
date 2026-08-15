import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { HamburgerMenu } from "./src/components/Hamburger";
import {Logo} from "./src/components/Logo";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <SafeAreaProvider>
     
      {showWelcome ? (
        <WelcomeScreen
          onContinue={() => setShowWelcome(false)}
        />
      ) : (
        <HamburgerMenu />
        <Logo />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      )}

      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}