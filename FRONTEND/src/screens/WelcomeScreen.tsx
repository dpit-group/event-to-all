import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";

type WelcomeScreenProps = {
  onContinue: () => void;
  onExplore: () => void;
  onLogin: () => void;
};

export function WelcomeScreen({
  onContinue,
  onExplore,
  onLogin,
}: WelcomeScreenProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../resources/Logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Text style={styles.events}>— events —</Text>

        <Text style={styles.slogan}>
          Join us<Text style={styles.orange}>!</Text>
        </Text>
      </View>

      {/* Main heading */}
      <Text style={styles.mainText}>Find it. Feel it. Live it.</Text>

      <Text style={styles.description}>
        Discover the best parties{"\n"}
        and events in your area.
      </Text>

      {/* Features */}
      <View style={styles.features}>
        <View style={styles.featureRow}>
          <Ionicons name="location-outline" size={25} color="#6d28d9" />
          <Text style={styles.featureText}>Events near you</Text>
        </View>

        <View style={styles.featureRow}>
          <Ionicons name="filter-outline" size={25} color="#6d28d9" />
          <Text style={styles.featureText}>Smart filters</Text>
        </View>

        <View style={styles.featureRow}>
          <Ionicons name="pricetag-outline" size={25} color="#6d28d9" />
          <Text style={styles.featureText}>Exclusive offers and discounts</Text>
        </View>

        <View style={styles.featureRow}>
          <Ionicons name="heart-outline" size={25} color="#6d28d9" />
          <Text style={styles.featureText}>Favorites & reminders</Text>
        </View>

        <View style={styles.featureRow}>
          <Ionicons name="star-outline" size={25} color="#6d28d9" />
          <Text style={styles.featureText}>Reviews and recommendations</Text>
        </View>

        <View style={styles.featureRow}>
          <Ionicons name="share-social-outline" size={25} color="#6d28d9" />
          <Text style={styles.featureText}>Share with friends</Text>
        </View>
      </View>

      {/* Continue as guest */}
      <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
        <Text style={styles.primaryButtonText}>Browse as Guest</Text>
      </TouchableOpacity>
      {/* Log in button */}
      <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
        <Text style={styles.secondaryButtonText}>Log in</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 52,
    paddingBottom: 30,
  },

  logoContainer: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 18,
  },

  logoImage: {
    width: 330,
    height: 90,
  },

  orange: {
    color: "#ff7417",
  },

  events: {
    color: "#6d28d9",
    fontSize: 20,
    letterSpacing: 5,
    marginTop: 2,
  },

  slogan: {
    fontSize: 32,
    color: "#6d28d9",
    fontStyle: "italic",
    marginTop: 8,
  },

  mainText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#20233d",
    marginTop: 8,
  },

  description: {
    fontSize: 15,
    color: "#4b4b60",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
  },

  features: {
    width: "100%",
    maxWidth: 420,
    marginTop: 24,
    marginBottom: 22,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },

  featureText: {
    fontSize: 15,
    color: "#303047",
    marginLeft: 15,
  },

  primaryButton: {
    width: "100%",
    maxWidth: 420,
    height: 55,
    backgroundColor: "#6d28d9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    width: "100%",
    maxWidth: 420,
    height: 55,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#7c3aed",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  loginButton: {
    width: "100%",
    maxWidth: 420,
    height: 55,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#7c3aed",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  secondaryButtonText: {
    color: "#6d28d9",
    fontSize: 16,
    fontWeight: "700",
  },

  bottomRow: {
    width: "100%",
    maxWidth: 420,
    marginTop: 22,
  },

  languageButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  languageText: {
    color: "#333333",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 7,
    marginRight: 5,
  },
});
