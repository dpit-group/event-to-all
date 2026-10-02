import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
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
import { userService } from "../services/UserService";

type RegisterScreenProps = NativeStackScreenProps<
  AccountStackParamList,
  "Register"
>;

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  function handleConfirmPasswordChange() {
    if (password !== confirmPassword) {
      setPasswordError("Password and Confirm Password do not match.");
      return false;
    }

    setPasswordError("");
    return true;
  }

  async function handleRegister() {
    if (
      !name.trim() ||
      !username.trim() ||
      !phoneNumber.trim() ||
      !email.trim() ||
      !password
    ) {
      Alert.alert("Missing details", "Complete all fields to register.");
      return;
    }

    if (!handleConfirmPasswordChange()) {
      Alert.alert("Passwords do not match");
      return;
    }

    try {
      const registeredUser = await userService.register({
        name: name.trim(),
        username: username.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        password,
        isBusinessAccount,
      });
      await login(
        registeredUser.username || registeredUser.name,
        registeredUser.isBusinessAccount ? "business" : "personal",
      );
      navigation.navigate("AccountMain");
    } catch {
      Alert.alert("Registration failed", "Check your details and try again.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email address"
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>
          {isBusinessAccount ? "Business account" : "Personal account"}
        </Text>
        <Switch
          value={isBusinessAccount}
          onValueChange={setIsBusinessAccount}
        />
      </View>
      <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
        <Text style={styles.primaryButtonText}>Register</Text>
      </TouchableOpacity>
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
    padding: 24,
  },
  title: {
    color: "#20233d",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#d2d2d2",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
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
  primaryButton: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#6f01ff",
    borderRadius: 6,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    width: "100%",
    maxWidth: 400,
    color: "#c62828",
    fontSize: 14,
    marginTop: -4,
    marginBottom: 8,
  },
});
