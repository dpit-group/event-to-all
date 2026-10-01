import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

export type Event = {
  id: number;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  date: string;
  time: string;
  minAge?: number;
  artist?: string;
  imageUrl: string;
};

type EventScreenProps = {
  route: {
    params: {
      event: Event;
      fromFavorites?: boolean;
      fromMyEvents?: boolean;
    };
  };
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: object) => void;
    getParent?: () =>
      | {
          navigate: (screen: string, params?: object) => void;
        }
      | undefined;
  };
};

export function EventScreen({ route, navigation }: EventScreenProps) {
  const { event } = route.params;
  const { isLoggedIn, isLoading } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(event.id);

  function editEvent() {
    navigation.navigate("EditEvent", { event });
  }

  function removeMyEvent() {
    Alert.alert("Remove event", `Remove ${event.name} from your events?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () =>
          navigation.navigate("MyEventsMain", {
            removedEventId: event.id,
          }),
      },
    ]);
  }

  function removeFromFavorites() {
    Alert.alert(
      "Remove favorite",
      `Remove ${event.name} from your favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            navigation.navigate("FavoriteMain", {
              removedEventId: event.id,
            }),
        },
      ],
    );
  }

  function handleFavoritePress() {
    if (favorite && route.params.fromFavorites) {
      removeFromFavorites();
      return;
    }

    if (!favorite && !isLoading && !isLoggedIn) {
      Alert.alert(
        "Login required",
        "You must be logged in to add events to favorites.",
      );
      return;
    }

    toggleFavorite(event);
  }

  function seeOnMap() {
    navigation.getParent?.()?.navigate("Map", {
      screen: "MapMain",
      params: { event },
    });
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: event.imageUrl }} style={styles.heroImage} />
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>{event.city.toUpperCase()}</Text>
        <Text style={styles.title}>{event.name}</Text>
        {event.artist ? (
          <Text style={styles.artist}>{event.artist}</Text>
        ) : null}
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Event details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>When</Text>
          <Text style={styles.detailValue}>
            {event.date} at {event.time}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Where</Text>
          <Text style={styles.detailValue}>
            {event.address}, {event.city}
          </Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.mapButton}
          onPress={seeOnMap}
        >
          <Ionicons name="map-outline" size={15} color="#6f01ff" />
          <Text style={styles.mapButtonText}>See on map</Text>
        </TouchableOpacity>
        {event.minAge !== undefined ? (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Minimum age</Text>
            <Text style={styles.detailValue}>{event.minAge}+</Text>
          </View>
        ) : null}
      </View>
      {!route.params.fromMyEvents ? (
        <TouchableOpacity
          accessibilityLabel={
            favorite
              ? `Remove ${event.name} from favorites`
              : `Add ${event.name} to favorites`
          }
          accessibilityRole="button"
          style={[
            styles.favoriteButton,
            favorite && styles.removeFavoriteButton,
          ]}
          onPress={handleFavoritePress}
        >
          <Text style={styles.removeFavoriteButtonText}>
            {favorite ? "Remove from favorites" : "Add to favorites"}
          </Text>
        </TouchableOpacity>
      ) : null}
      {route.params.fromMyEvents ? (
        <View style={styles.myEventActions}>
          <TouchableOpacity style={styles.editEventButton} onPress={editEvent}>
            <Text style={styles.actionButtonText}>Edit Event</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeEventButton}
            onPress={removeMyEvent}
          >
            <Text style={styles.actionButtonText}>Remove Event</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {!route.params.fromMyEvents ? (
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.buyTicketsButton}
          onPress={() => navigation.navigate("Ticket", { event })}
        >
          <Ionicons name="ticket-outline" size={20} color="#fff" />
          <Text style={styles.buyTicketsButtonText}>Buy tickets</Text>
        </TouchableOpacity>
      ) : null}
      <StatusBar style="light" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f3ff",
  },
  hero: {
    backgroundColor: "#6f01ff",
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 48,
  },
  heroImage: {
    width: "100%",
    height: 230,
  },
  eyebrow: {
    color: "#e5d6ff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
  },
  artist: {
    color: "#f0eaff",
    fontSize: 18,
    marginTop: 12,
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    margin: 20,
    padding: 22,
    shadowColor: "#241044",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    color: "#20233d",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
  },
  detailRow: {
    borderTopWidth: 1,
    borderTopColor: "#eeeaf7",
    paddingVertical: 14,
  },
  detailLabel: {
    color: "#77718a",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  detailValue: {
    color: "#20233d",
    fontSize: 16,
    lineHeight: 22,
  },
  mapButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0eaff",
    borderRadius: 16,
    gap: 5,
    marginTop: 8,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  mapButtonText: {
    color: "#6f01ff",
    fontSize: 13,
    fontWeight: "700",
  },
  removeFavoriteButton: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 6,
    backgroundColor: "#d62828",
    paddingVertical: 14,
    alignItems: "center",
  },
  favoriteButton: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 6,
    backgroundColor: "#6f01ff",
    paddingVertical: 14,
    alignItems: "center",
  },
  removeFavoriteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  myEventActions: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 24,
  },
  editEventButton: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: "#6f01ff",
    paddingVertical: 14,
    alignItems: "center",
  },
  removeEventButton: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: "#d62828",
    paddingVertical: 14,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  buyTicketsButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#ff7417",
    borderRadius: 6,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 28,
    paddingVertical: 15,
    width: "88%",
  },
  buyTicketsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
