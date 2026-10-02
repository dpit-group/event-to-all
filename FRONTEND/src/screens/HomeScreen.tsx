import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { EventCard } from "../components/EventCard";
import { HamburgerMenu } from "../components/Hamburger";
import type { HomeStackParamList } from "../navigation/RootNavigator";
import { sampleEvents } from "../resources/events";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { eventService } from "../services/EventService";
import { Event } from "../dto/Events";
type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, "HomeMain">;

export function HomeScreen({ navigation }: HomeScreenProps) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    eventService
      .getAll()
      .then((data) => {
        console.log("Eventuri primite de service: ", data);
        setEvents(data);
      })
      .catch((error: unknown) => {
        console.error("Eroare la încărcarea eventurilor:", error);
        console.error("Nu am putut încărca eventurile");
      })
      .finally(() => console.log("Încărcarea eventurilor finalizată"));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.menuOverlay}></View>
      <Text style={styles.title}>Upcoming events</Text>
      <FlatList
        contentContainerStyle={styles.list}
        data={events}
        keyExtractor={(event) => event.id.toString()}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            variant="featured"
            showFavorite
            onPress={() => navigation.navigate("Event", { event: item })}
          />
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 24,
  },
  menuOverlay: {
    position: "absolute",
    top: -40,
    left: 10,
    zIndex: 2000,
  },
  title: {
    color: "#20233d",
    fontSize: 28,
    fontWeight: "800",
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
});
