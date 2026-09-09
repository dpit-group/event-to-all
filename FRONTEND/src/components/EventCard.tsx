import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { useFavorites } from "../context/FavoritesContext";
import type { Event } from "../screens/EventScreen";

type EventCardProps = {
  event: Event;
  onPress: () => void;
  onRemove?: () => void;
  showFavorite?: boolean;
  variant?: "compact" | "featured";
};

export function EventCard({
  event,
  onPress,
  onRemove,
  showFavorite = false,
  variant = "compact",
}: EventCardProps) {
  const isFeatured = variant === "featured";
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(event.id);

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
        style={[
          styles.cardContent,
          !isFeatured && styles.compactCardContent,
          isFeatured && styles.featuredCardContent,
        ]}
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
      {showFavorite ? (
        <Pressable
          accessibilityLabel={
            favorite
              ? `Remove ${event.name} from favorites`
              : `Add ${event.name} to favorites`
          }
          accessibilityRole="button"
          hitSlop={8}
          style={styles.favoriteButton}
          onPress={(pressEvent) => {
            pressEvent.stopPropagation();
            toggleFavorite(event);
          }}
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={24}
            color={favorite ? "#d62828" : "#6f01ff"}
          />
        </Pressable>
      ) : null}
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
    alignSelf: "stretch",
  },
  featuredImage: {
    width: "100%",
    height: 220,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  compactCardContent: {
    padding: 9,
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
    marginTop: 3,
  },
  eventMeta: {
    color: "#4d4960",
    fontSize: 14,
    marginTop: 7,
  },
  eventLocation: {
    color: "#77718a",
    fontSize: 13,
    marginTop: 3,
  },
  removeButton: {
    alignSelf: "flex-start",
    paddingTop: 14,
    paddingRight: 2,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 10,
    zIndex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
  },
  chevron: {
    alignSelf: "center",
    color: "#6f01ff",
    fontSize: 30,
    paddingHorizontal: 16,
  },
});
