import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { AccountStackParamList } from "../navigation/RootNavigator";
import type { Event } from "./EventScreen";
import { formatEventDate } from "../services/ParseDateString";

type BoughtTicketDetailsScreenProps = NativeStackScreenProps<
  AccountStackParamList,
  "BoughtTicketDetails"
>;

export function BoughtTicketDetailsScreen({
  route,
  navigation,
}: BoughtTicketDetailsScreenProps) {
  const { event } = route.params;

  function seeOnMap() {
    navigation.getParent?.()?.navigate("Map", {
      screen: "MapMain",
      params: { event },
    });
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Image source={{ uri: event.background }} style={styles.eventImage} />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>TICKET DETAILS</Text>
        <Text style={styles.eventName}>{event.name}</Text>
        {event.artist ? (
          <Text style={styles.artist}>{event.artist}</Text>
        ) : null}

        <View style={styles.detailSection}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View individual tickets"
            onPress={() =>
              navigation.navigate("BoughtTicketPasses", {
                event,
                purchaseId: route.params.purchaseId,
                adultTickets: route.params.adultTickets,
                childTickets: route.params.childTickets,
              })
            }
            style={({ pressed }) => [
              styles.ticketsButton,
              pressed && styles.ticketsButtonPressed,
            ]}
          >
            <View>
              <Text style={styles.ticketsButtonTitle}>Tickets</Text>
              <Text style={styles.ticketsButtonSubtitle}>
                View your individual tickets
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6f01ff" />
          </Pressable>
          {route.params.adultTickets === undefined &&
          route.params.childTickets === undefined ? (
            <Text style={styles.detailValue}>
              Ticket quantities unavailable
            </Text>
          ) : (
            <>
              {route.params.adultTickets ? (
                <Text style={styles.detailValue}>
                  {route.params.adultTickets} adult ticket
                  {route.params.adultTickets === 1 ? "" : "s"}
                </Text>
              ) : null}
              {route.params.childTickets ? (
                <Text style={styles.detailValue}>
                  {route.params.childTickets} child ticket
                  {route.params.childTickets === 1 ? "" : "s"}
                </Text>
              ) : null}
              {!route.params.adultTickets && !route.params.childTickets ? (
                <Text style={styles.detailValue}>No tickets</Text>
              ) : null}
            </>
          )}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>When</Text>
          <Text style={styles.detailValue}>{formatEventDate(event.startDate)}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Where</Text>
          <View style={styles.locationRow}>
            <View style={styles.locationTextWrap}>
              <Text style={styles.detailValue}>{event.address}</Text>
              <Text style={styles.detailValue}>{event.city}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`See ${event.name} on map`}
              onPress={seeOnMap}
              style={styles.mapButton}
            >
              <Ionicons name="map-outline" size={15} color="#6f01ff" />
              <Text style={styles.mapButtonText}>See on map</Text>
            </Pressable>
          </View>
        </View>

        {event.minAge !== undefined ? (
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Age requirement</Text>
            <Text style={styles.detailValue}>{event.minAge}+</Text>
          </View>
        ) : null}
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

type BoughtTicketPassesScreenProps = {
  route: {
    params: {
      event: Event;
      purchaseId?: string;
      adultTickets?: number;
      childTickets?: number;
    };
  };
};

type IndividualTicket = {
  id: string;
  type: "Adult" | "Child";
};

export function BoughtTicketPassesScreen({
  route,
}: BoughtTicketPassesScreenProps) {
  const {
    event,
    purchaseId = `event-${route.params.event.id}`,
    adultTickets = 0,
    childTickets = 0,
  } = route.params;
  const tickets: IndividualTicket[] = [
    ...Array.from({ length: adultTickets }, (_, index) => ({
      id: `${purchaseId}-AD-${String(index + 1).padStart(3, "0")}`,
      type: "Adult" as const,
    })),
    ...Array.from({ length: childTickets }, (_, index) => ({
      id: `${purchaseId}-CH-${String(index + 1).padStart(3, "0")}`,
      type: "Child" as const,
    })),
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.passListContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.passListEventName}>{event.name}</Text>
      <Text style={styles.passListEventMeta}>
        {formatEventDate(event.startDate)} · {event.city} · {event.address}
      </Text>
      <Text style={styles.passListCaption}>
        {tickets.length} individual ticket{tickets.length === 1 ? "" : "s"}
      </Text>

      {tickets.length === 0 ? (
        <Text style={styles.passListEmpty}>
          No individual tickets were saved.
        </Text>
      ) : (
        tickets.map((ticket) => (
          <View key={ticket.id} style={styles.passListTicketRow}>
            <Text style={styles.passListTicketLabel}>{ticket.type} ticket</Text>
            <Text selectable style={styles.passListTicketId}>
              {ticket.id}
            </Text>
          </View>
        ))
      )}
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingBottom: 28,
  },
  eventImage: {
    width: "100%",
    height: 240,
    backgroundColor: "#eeeaf7",
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  eyebrow: {
    color: "#6f01ff",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  eventName: {
    color: "#20233d",
    fontSize: 28,
    fontWeight: "800",
  },
  artist: {
    color: "#6f01ff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 6,
  },
  detailSection: {
    backgroundColor: "#faf8ff",
    borderLeftColor: "#ff7417",
    borderLeftWidth: 3,
    borderRadius: 10,
    marginTop: 22,
    padding: 16,
  },
  sectionTitle: {
    color: "#4f00bc",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  ticketsButton: {
    alignItems: "center",
    backgroundColor: "#f0eaff",
    borderColor: "#d8c7ff",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  ticketsButtonPressed: {
    opacity: 0.7,
  },
  ticketsButtonTitle: {
    color: "#4f00bc",
    fontSize: 16,
    fontWeight: "700",
  },
  ticketsButtonSubtitle: {
    color: "#6b6280",
    fontSize: 12,
    marginTop: 3,
  },
  detailValue: {
    color: "#5e596d",
    fontSize: 16,
    lineHeight: 24,
  },
  locationRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  locationTextWrap: {
    flex: 1,
    flexShrink: 1,
  },
  mapButton: {
    alignItems: "center",
    backgroundColor: "#f0eaff",
    borderRadius: 16,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  mapButtonText: {
    color: "#6f01ff",
    fontSize: 12,
    fontWeight: "700",
  },
  passListContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 32,
  },
  passListEventName: {
    color: "#20233d",
    fontSize: 23,
    fontWeight: "800",
  },
  passListEventMeta: {
    color: "#77718a",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  passListCaption: {
    color: "#20233d",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 8,
  },
  passListTicketRow: {
    borderTopColor: "#e7e3ed",
    borderTopWidth: 1,
    paddingVertical: 15,
  },
  passListTicketLabel: {
    color: "#20233d",
    fontSize: 16,
    fontWeight: "700",
  },
  passListTicketId: {
    color: "#6f01ff",
    fontSize: 14,
    fontVariant: ["tabular-nums"],
    marginTop: 5,
  },
  passListEmpty: {
    color: "#77718a",
    fontSize: 15,
    paddingVertical: 14,
  },
});
