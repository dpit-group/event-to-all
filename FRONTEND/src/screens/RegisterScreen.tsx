import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  function handleConfirmPasswordChange() {
    if (password !== confirmPassword) {
      setPasswordError("Password and Confirm Password do not match.");
      return;
    }

    setPasswordError("");
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
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleConfirmPasswordChange}
      >
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
