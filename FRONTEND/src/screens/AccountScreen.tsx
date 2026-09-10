import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { AccountStackParamList } from "../navigation/RootNavigator";
import { useAuth } from "../context/AuthContext";

type AccountScreenProps = NativeStackScreenProps<
  AccountStackParamList,
  "AccountMain"
>;

export function AccountScreen({ navigation }: AccountScreenProps) {
  const { isLoggedIn, login, logout, user } = useAuth();
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!username.trim() || !password) {
      return;
    }

    await login(
      username.trim(),
      isBusinessAccount ? "business" : "personal",
    );
  }

  async function handleLogout() {
    await logout();
    setUsername("");
    setPassword("");
  }

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.loggedInContainer}>
            <View style={styles.accountHeader}>
              <Text style={styles.username}>Welcome, {user?.username}</Text>
              <Text style={styles.accountType}>
                {user?.accountType === "business"
                  ? "Business account"
                  : "Personal account"}
              </Text>
            </View>

            <View style={styles.accountActions}>
              {user?.accountType === "business" ? (
                <TouchableOpacity
                  style={styles.addEventButton}
                  onPress={() => navigation.navigate("AddEvent")}
                >
                  <Text style={styles.addEventButtonText}>Add Event</Text>
                </TouchableOpacity>
              ) : null}

              <View style={styles.footerActions}>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutButtonText}>Log out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.form}>
          <Text style={styles.title}>Log in</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              {isBusinessAccount ? "Business account" : "Personal account"}
            </Text>
            <Switch
              value={isBusinessAccount}
              onValueChange={setIsBusinessAccount}
            />
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: "#20233d",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d2d2d2",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#6f01ff",
    borderRadius: 6,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  registerButton: {
    paddingVertical: 14,
  },
  registerButtonText: {
    color: "#6f01ff",
    fontSize: 18,
    fontWeight: "600",
  },
  username: {
    width: "100%",
    color: "#20233d",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 18,
  },
  accountType: {
    color: "#77718a",
    fontSize: 16,
    marginTop: -10,
    marginBottom: 18,
  },
  loggedInContainer: {
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
  },
  accountHeader: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  accountActions: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  toggleRow: {
    width: "100%",
    maxWidth: 400,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  toggleLabel: {
    color: "#20233d",
    fontSize: 16,
  },
  addEventButton: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    backgroundColor: "#6f01ff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#4c00c2",
    paddingVertical: 15,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  addEventButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  footerActions: {
    width: "100%",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 28,
  },
  logoutButton: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#6f01ff",
    borderRadius: 6,
    paddingHorizontal: 28,
    paddingVertical: 11,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#6f01ff",
    fontSize: 18,
    fontWeight: "600",
  },
});
