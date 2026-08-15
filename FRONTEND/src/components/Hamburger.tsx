import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* Butonul hamburger */}
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={styles.menuButton}
      >
        <Ionicons
          name={isOpen ? "close" : "menu"}
          size={30}
          color="black"
        />
      </Pressable>

      {/* Dropdown */}
      {isOpen && (
        <View style={styles.dropdown}>
          <Pressable style={styles.menuItem}>
            <Text style={styles.menuText}>Home</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuText}>Search</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuText}>Favorites</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuText}>Account</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 100,
  },

  menuButton: {
    padding: 10,
    width: 50,
  },

  dropdown: {
    position: "absolute",
    top: 55,
    left: 0,

    width: 180,

    backgroundColor: "white",
    borderRadius: 10,

    paddingVertical: 5,

    elevation: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },

  menuText: {
    fontSize: 16,
  },
});