import { StatusBar } from "expo-status-bar";
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

type BoughtTicketDetailsScreenProps = NativeStackScreenProps<
  AccountStackParamList,
  "BoughtTicketDetails"
>;

export function BoughtTicketDetailsScreen({
  route,
  navigation,
}: BoughtTicketDetailsScreenProps) {
  const { event } = route.params;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
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
          >
            <Text style={styles.sectionTitle}>Tickets ›</Text>
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
          <Text style={styles.detailValue}>{event.date}</Text>
          <Text style={styles.detailValue}>{event.time}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Where</Text>
          <Text style={styles.detailValue}>{event.address}</Text>
          <Text style={styles.detailValue}>{event.city}</Text>
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
        {event.date} · {event.time}
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
    borderTopColor: "#e7e3ed",
    borderTopWidth: 1,
    marginTop: 22,
    paddingTop: 16,
  },
  sectionTitle: {
    color: "#20233d",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  detailValue: {
    color: "#5e596d",
    fontSize: 16,
    lineHeight: 24,
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
