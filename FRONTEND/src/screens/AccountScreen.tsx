import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { AccountStackParamList } from "../navigation/RootNavigator";
import { useAuth } from "../context/AuthContext";
import { BoughtTickets } from "../components/BoughtTickets";
import { usePurchasedEvents } from "../context/PurchasedEventsContext";
import { userService } from "../services/UserService";

type AccountScreenProps = NativeStackScreenProps<
  AccountStackParamList,
  "AccountMain"
>;

export function AccountScreen({ navigation }: AccountScreenProps) {
  const { isLoggedIn, login, logout, user } = useAuth();
  const { purchasedEvents } = usePurchasedEvents();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Enter your email and password.");
      return;
    }

    try {
      const authenticatedUser = await userService.login(email.trim(), password);
      await login(
        authenticatedUser.username || authenticatedUser.name,
        authenticatedUser.isBusinessAccount ? "business" : "personal",
      );
    } catch {
      Alert.alert("Login failed", "Check your email and password and try again.");
    }
  }

  async function handleLogout() {
    await logout();
    setEmail("");
    setPassword("");

    const parentNavigator = navigation.getParent() as
      | { navigate: (routeName: string) => void }
      | undefined;

    if (parentNavigator) {
      parentNavigator.navigate("Home");
      return;
    }

    (navigation as any).navigate("Home");
  }

  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={styles.accountIcon}>
        <Ionicons name="person" size={32} color="#6f01ff" />
      </View>
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

            <View style={styles.boughtTicketsSection}>
              <Text style={styles.boughtTicketsTitle}>Bought Tickets</Text>
              <BoughtTickets
                tickets={purchasedEvents}
                onSelectTicket={(ticket) =>
                  navigation.navigate("BoughtTicketDetails", {
                    event: ticket,
                    purchaseId: ticket.purchaseId,
                    adultTickets: ticket.adultTickets,
                    childTickets: ticket.childTickets,
                  })
                }
              />
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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
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
    justifyContent: "flex-start",
    paddingTop: 64,
    paddingBottom: 12,
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
  accountIcon: {
    alignItems: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 12,
    zIndex: 1,
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
    flex: 1,
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
  },
  accountHeader: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  boughtTicketsSection: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
  },
  boughtTicketsTitle: {
    color: "#20233d",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  accountActions: {
    flex: 1,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
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
    paddingTop: 16,
  },
  logoutButton: {
    minWidth: 120,
    borderWidth: 1,
    borderColor: "#6f01ff",
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#6f01ff",
    fontSize: 15,
    fontWeight: "600",
  },
});
