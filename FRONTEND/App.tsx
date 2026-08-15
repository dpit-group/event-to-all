import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { HamburgerMenu } from "./src/components/Hamburger";
import {Logo} from "./src/components/Logo";

export default function App() {
  return (
    <SafeAreaProvider>
      <HamburgerMenu />
      <Logo />
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
