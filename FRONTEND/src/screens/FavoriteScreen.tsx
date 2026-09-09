import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { EventCard } from "../components/EventCard";
import type { FavoriteStackParamList } from "../navigation/RootNavigator";
import { sampleEvents } from "../resources/events";

type FavoriteScreenProps = NativeStackScreenProps<
  FavoriteStackParamList,
  "FavoriteMain"
>;

export function FavoriteScreen({ navigation, route }: FavoriteScreenProps) {
  const [events, setEvents] = useState(sampleEvents);

  useEffect(() => {
    const removedEventId = route.params?.removedEventId;
    if (removedEventId === undefined) {
      return;
    }

    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== removedEventId),
    );
    navigation.setParams({ removedEventId: undefined });
  }, [navigation, route.params?.removedEventId]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your favorites</Text>
        <Text style={styles.subtitle}>Events you saved for later</Text>
      </View>
      <FlatList
        contentContainerStyle={[
          styles.list,
          events.length === 0 && styles.emptyList,
        ]}
        data={events}
        keyExtractor={(event) => event.id.toString()}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() =>
              navigation.navigate("Event", {
                event: item,
                fromFavorites: true,
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            You have not saved any favorite events yet.
          </Text>
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
    flexGrow: 1,
  },
  emptyList: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
  },
  emptyText: {
    color: "#77718a",
    fontSize: 16,
    textAlign: "center",
  },
});
