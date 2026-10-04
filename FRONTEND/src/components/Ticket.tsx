import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Event } from "../screens/EventScreen";
import type { PurchasedEvent } from "../context/PurchasedEventsContext";

type TicketProps = {
  event: Event & Pick<PurchasedEvent, "adultTickets" | "childTickets">;
  onPress: () => void;
};

function formatDate(value: Date | string | undefined): string {
  if (value === undefined) {
    return "Date unavailable";
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString("en-GB");
}

export function Ticket({ event, onPress }: TicketProps) {
  return (
    <Pressable
      accessibilityLabel={`View ticket details for ${event.name}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.ticket, pressed && styles.pressedTicket]}
    >
      <Text style={styles.eventName}>{event.name}</Text>
      {event.artist ? <Text style={styles.artist}>{event.artist}</Text> : null}
      <Text style={styles.details}>
        {formatDate(event.startDate)} · {formatDate(event.endDate)}
      </Text>
      <Text style={styles.details}>
        {event.city} · {event.address}
      </Text>
      {event.adultTickets !== undefined || event.childTickets !== undefined ? (
        <Text style={styles.ticketCount}>
          {[
            event.adultTickets ? `${event.adultTickets} adult` : null,
            event.childTickets ? `${event.childTickets} child` : null,
          ]
            .filter(Boolean)
            .join(" · ") || "No tickets"}
        </Text>
      ) : (
        <Text style={styles.ticketCount}>Ticket quantities unavailable</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ticket: {
    backgroundColor: "#f7f3ff",
    borderLeftColor: "#ff7417",
    borderLeftWidth: 4,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  pressedTicket: {
    opacity: 0.7,
  },
  eventName: {
    color: "#20233d",
    fontSize: 17,
    fontWeight: "700",
  },
  artist: {
    color: "#6f01ff",
    fontSize: 14,
    marginTop: 3,
  },
  details: {
    color: "#77718a",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  ticketCount: {
    color: "#20233d",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 7,
  },
});
