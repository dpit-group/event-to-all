import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { Event } from "../screens/EventScreen";

type EventCardProps = {
  event: Event;
  onPress: () => void;
  onRemove?: () => void;
  variant?: "compact" | "featured";
};

export function EventCard({
  event,
  onPress,
  onRemove,
  variant = "compact",
}: EventCardProps) {
  const isFeatured = variant === "featured";

  return (
    <Pressable
      style={[styles.eventCard, isFeatured && styles.featuredCard]}
      onPress={onPress}
    >
      <View style={[styles.cardAccent, isFeatured && styles.featuredAccent]} />
      <Image
        source={{ uri: event.imageUrl }}
        style={[styles.thumbnail, isFeatured && styles.featuredImage]}
      />
      <View
        style={[styles.cardContent, isFeatured && styles.featuredCardContent]}
      >
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.eventArtist}>{event.artist}</Text>
        <Text style={styles.eventMeta}>
          {event.date} · {event.time}
        </Text>
        <Text style={styles.eventLocation}>
          {event.city} · {event.address}
        </Text>
      </View>
      {onRemove ? (
        <Pressable
          accessibilityLabel={`Remove ${event.name} from favorites`}
          hitSlop={8}
          style={styles.removeButton}
          onPress={(pressEvent) => {
            pressEvent.stopPropagation();
            onRemove();
          }}
        >
          <Ionicons name="close" size={25} color="#d62828" />
        </Pressable>
      ) : null}
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#241044",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardAccent: {
    width: 7,
    backgroundColor: "#ff7417",
  },
  featuredCard: {
    flexDirection: "column",
    marginBottom: 20,
  },
  featuredAccent: {
    width: "100%",
    height: 7,
  },
  thumbnail: {
    width: 94,
    height: 118,
    alignSelf: "center",
  },
  featuredImage: {
    width: "100%",
    height: 220,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  featuredCardContent: {
    padding: 20,
  },
  eventName: {
    color: "#20233d",
    fontSize: 19,
    fontWeight: "800",
  },
  eventArtist: {
    color: "#6f01ff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
  },
  eventMeta: {
    color: "#4d4960",
    fontSize: 14,
    marginTop: 12,
  },
  eventLocation: {
    color: "#77718a",
    fontSize: 13,
    marginTop: 5,
  },
  removeButton: {
    alignSelf: "flex-start",
    paddingTop: 14,
    paddingRight: 2,
  },
  chevron: {
    alignSelf: "center",
    color: "#6f01ff",
    fontSize: 30,
    paddingHorizontal: 16,
  },
});
