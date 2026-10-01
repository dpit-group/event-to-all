import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { Event } from "./EventScreen";
import { usePurchasedEvents } from "../context/PurchasedEventsContext";

const PAYMENT_METHODS = [
  { label: "Apple Pay", icon: "logo-apple" },
  { label: "Google Pay", icon: "logo-google" },
  { label: "Credit or debit card", icon: "card-outline" },
  { label: "PayPal", icon: "logo-paypal" },
  { label: "Revolut Pay", icon: "wallet-outline" },
  { label: "Klarna", icon: "card-outline" },
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number]["label"];

type TicketScreenProps = {
  route: {
    params: {
      event: Event;
    };
  };
  navigation: {
    goBack: () => void;
  };
};

export function TicketScreen({ route }: TicketScreenProps) {
  const { event } = route.params;
  const { addPurchasedEvent } = usePurchasedEvents();
  const [quantities, setQuantities] = useState({ adult: 1, child: 0 });
  const [isPaymentSheetVisible, setIsPaymentSheetVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const totalQuantity = quantities.adult + quantities.child;

  function adjustQuantity(type: "adult" | "child", amount: number) {
    setQuantities((current) => {
      const nextQuantity = current[type] + amount;
      const nextTotal = current.adult + current.child + amount;

      if (nextQuantity < 0 || nextTotal > 10) {
        return current;
      }

      return { ...current, [type]: nextQuantity };
    });
  }

  async function choosePaymentMethod(method: PaymentMethod) {
    if (totalQuantity < 1) {
      Alert.alert("No tickets selected", "Choose at least one ticket first.");
      return;
    }

    try {
      await addPurchasedEvent(event, quantities.adult, quantities.child);
    } catch (error) {
      Alert.alert(
        "Ticket not added",
        error instanceof Error ? error.message : "Please try again.",
      );
      return;
    }

    setPaymentMethod(method);
    setIsPaymentSheetVisible(false);
    Alert.alert(
      "Demo ticket added",
      `${totalQuantity} ticket${totalQuantity === 1 ? "" : "s"} for ${event.name} were added to your account using ${method}. Payment is not connected and no charge was made.`,
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.eventSummary}>
        <Text style={styles.eyebrow}>TICKETS FOR</Text>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.eventDetails}>
          {event.date} · {event.time}
        </Text>
        <Text style={styles.eventDetails}>
          {event.city} · {event.address}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose tickets</Text>
        {(
          [
            {
              key: "adult",
              label: "Adult tickets",
              description: "Standard admission",
            },
            {
              key: "child",
              label: "Child tickets",
              description: "Child admission",
            },
          ] as const
        ).map(({ key, label, description }, index) => (
          <View
            key={key}
            style={[
              styles.ticketQuantityRow,
              index > 0 && styles.ticketQuantityRowBorder,
            ]}
          >
            <View style={styles.ticketQuantityCopy}>
              <Text style={styles.ticketQuantityTitle}>{label}</Text>
              <Text style={styles.ticketQuantityDescription}>
                {description}
              </Text>
            </View>
            <View style={styles.quantityControls}>
              <Pressable
                accessibilityLabel={`Decrease ${label.toLowerCase()}`}
                accessibilityRole="button"
                disabled={quantities[key] === 0}
                onPress={() => adjustQuantity(key, -1)}
                style={[
                  styles.stepButton,
                  quantities[key] === 0 && styles.disabledStepButton,
                ]}
              >
                <Ionicons name="remove" size={20} color="#3d3157" />
              </Pressable>
              <Text
                accessibilityLiveRegion="polite"
                style={styles.quantityValue}
              >
                {quantities[key]}
              </Text>
              <Pressable
                accessibilityLabel={`Increase ${label.toLowerCase()}`}
                accessibilityRole="button"
                disabled={totalQuantity >= 10}
                onPress={() => adjustQuantity(key, 1)}
                style={[
                  styles.stepButton,
                  totalQuantity >= 10 && styles.disabledStepButton,
                ]}
              >
                <Ionicons name="add" size={20} color="#3d3157" />
              </Pressable>
            </View>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total tickets</Text>
          <Text style={styles.totalValue}>{totalQuantity}</Text>
        </View>
      </View>

      <View style={styles.checkout}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isPaymentSheetVisible }}
          onPress={() => setIsPaymentSheetVisible(true)}
          style={styles.payButton}
        >
          <Text style={styles.payButtonText}>Pay now</Text>
          <Ionicons name="card-outline" size={20} color="#fff" />
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        onRequestClose={() => setIsPaymentSheetVisible(false)}
        transparent
        visible={isPaymentSheetVisible}
      >
        <View style={styles.sheetOverlay}>
          <Pressable
            accessibilityLabel="Close payment methods"
            accessibilityRole="button"
            onPress={() => setIsPaymentSheetVisible(false)}
            style={styles.sheetBackdrop}
          />
          <View accessibilityViewIsModal style={styles.paymentSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Payment method</Text>
                <Text style={styles.sheetSubtitle}>
                  Choose how you want to pay
                </Text>
              </View>
              <Pressable
                accessibilityLabel="Close payment methods"
                accessibilityRole="button"
                onPress={() => setIsPaymentSheetVisible(false)}
                style={styles.closeSheetButton}
              >
                <Ionicons name="close" size={22} color="#3d3157" />
              </Pressable>
            </View>
            <View style={styles.paymentOptions}>
              {PAYMENT_METHODS.map(({ label, icon }) => (
                <Pressable
                  key={label}
                  accessibilityRole="button"
                  onPress={() => choosePaymentMethod(label)}
                  style={styles.paymentOption}
                >
                  <View style={styles.paymentOptionIcon}>
                    <Ionicons name={icon} size={21} color="#4f00bc" />
                  </View>
                  <Text style={styles.paymentOptionText}>{label}</Text>
                  {paymentMethod === label ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={21}
                      color="#6f01ff"
                    />
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#928ba0"
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f3ff",
    padding: 20,
    paddingBottom: 36,
  },
  eventSummary: {
    backgroundColor: "#6f01ff",
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
  },
  eyebrow: {
    color: "#e5d6ff",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  eventName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },
  eventDetails: {
    color: "#f0eaff",
    fontSize: 14,
    lineHeight: 21,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    padding: 18,
  },
  sectionTitle: {
    color: "#20233d",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 14,
  },
  ticketQuantityRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 72,
  },
  ticketQuantityRowBorder: {
    borderTopColor: "#eeeaf7",
    borderTopWidth: 1,
  },
  ticketQuantityCopy: {
    flex: 1,
    marginRight: 10,
  },
  ticketQuantityTitle: {
    color: "#20233d",
    fontSize: 15,
    fontWeight: "700",
  },
  ticketQuantityDescription: {
    color: "#77718a",
    fontSize: 13,
    marginTop: 4,
  },
  quantityControls: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  stepButton: {
    alignItems: "center",
    backgroundColor: "#f0eaff",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  disabledStepButton: {
    opacity: 0.4,
  },
  quantityValue: {
    color: "#20233d",
    fontSize: 17,
    fontWeight: "700",
    minWidth: 20,
    textAlign: "center",
  },
  totalRow: {
    alignItems: "center",
    borderTopColor: "#eeeaf7",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 14,
  },
  totalLabel: {
    color: "#20233d",
    fontSize: 15,
    fontWeight: "700",
  },
  totalValue: {
    color: "#6f01ff",
    fontSize: 17,
    fontWeight: "800",
  },
  checkout: {
    alignSelf: "center",
    maxWidth: 520,
    width: "100%",
  },
  payButton: {
    alignItems: "center",
    backgroundColor: "#6f01ff",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 18,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(24, 17, 38, 0.48)",
  },
  paymentSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: "#d8d3df",
    borderRadius: 3,
    height: 5,
    marginBottom: 16,
    width: 38,
  },
  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sheetTitle: {
    color: "#20233d",
    fontSize: 20,
    fontWeight: "800",
  },
  sheetSubtitle: {
    color: "#77718a",
    fontSize: 14,
    marginTop: 4,
  },
  closeSheetButton: {
    alignItems: "center",
    backgroundColor: "#f0eaff",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  paymentOptions: {
    borderTopColor: "#eeeaf7",
    borderTopWidth: 1,
  },
  paymentOption: {
    alignItems: "center",
    borderBottomColor: "#eeeaf7",
    borderBottomWidth: 1,
    flexDirection: "row",
    minHeight: 58,
    paddingVertical: 8,
  },
  paymentOptionIcon: {
    alignItems: "center",
    backgroundColor: "#f0eaff",
    borderRadius: 20,
    height: 38,
    justifyContent: "center",
    marginRight: 13,
    width: 38,
  },
  paymentOptionText: {
    color: "#20233d",
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
});
