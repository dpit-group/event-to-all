import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event map</Text>
      <Text style={styles.message}>Discover events near you.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f6f6",
    padding: 24,
  },
  title: {
    color: "#20233d",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  message: {
    color: "#666",
    fontSize: 16,
  },
});
