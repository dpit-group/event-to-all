import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Event } from "../screens/EventScreen";
import type { PurchasedEvent } from "../context/PurchasedEventsContext";

type TicketProps = {
  event: Event & Pick<PurchasedEvent, "adultTickets" | "childTickets">;
  onPress: () => void;
};

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
        {event.date} · {event.time}
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
    borderTopColor: "#e7e3ed",
    borderTopWidth: 1,
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
