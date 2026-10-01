import { StyleSheet, Text, View } from "react-native";

import type { PurchasedEvent } from "../context/PurchasedEventsContext";
import { Ticket } from "./Ticket";

type BoughtTicketsProps = {
  tickets: PurchasedEvent[];
  onSelectTicket: (ticket: PurchasedEvent) => void;
};

export function BoughtTickets({ tickets, onSelectTicket }: BoughtTicketsProps) {
  return (
    <View style={styles.list}>
      {tickets.length === 0 ? (
        <Text style={styles.emptyText}>No bought tickets to show.</Text>
      ) : (
        tickets.map((ticket, index) => (
          <Ticket
            key={ticket.purchaseId ?? `${ticket.id}-${index}`}
            event={ticket}
            onPress={() => onSelectTicket(ticket)}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
  emptyText: {
    color: "#77718a",
    fontSize: 15,
    paddingVertical: 12,
  },
});
