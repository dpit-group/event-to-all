import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { EventCard } from "../components/EventCard";
import type { FavoriteStackParamList } from "../navigation/RootNavigator";
import { sampleEvents } from "../resources/events";

type FavoriteScreenProps = NativeStackScreenProps<
  FavoriteStackParamList,
  "FavoriteMain"
>;

export function FavoriteScreen({ navigation }: FavoriteScreenProps) {
  const [events, setEvents] = useState(sampleEvents);

  function confirmRemoveFavorite(eventId: number) {
    Alert.alert(
      "Remove favorite",
      "Are you sure you want to remove this event from favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setEvents((currentEvents) =>
              currentEvents.filter((event) => event.id !== eventId),
            );
          },
        },
      ],
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your favorites</Text>
        <Text style={styles.subtitle}>Events you saved for later</Text>
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={events}
        keyExtractor={(event) => event.id.toString()}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => navigation.navigate("Event", { event: item })}
            onRemove={() => confirmRemoveFavorite(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No favorite events yet.</Text>
        }
      />
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#6f01ff",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 26,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#e5d6ff",
    fontSize: 15,
    marginTop: 6,
  },
  list: {
    padding: 18,
  },
  emptyText: {
    color: "#77718a",
    fontSize: 16,
    textAlign: "center",
  },
});
