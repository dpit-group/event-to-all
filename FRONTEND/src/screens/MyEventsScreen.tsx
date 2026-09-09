import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { EventCard } from "../components/EventCard";
import type { MyEventsStackParamList } from "../navigation/RootNavigator";
import { sampleEvents } from "../resources/events";

type MyEventsScreenProps = NativeStackScreenProps<
  MyEventsStackParamList,
  "MyEventsMain"
>;

export function MyEventScreen({ navigation, route }: MyEventsScreenProps) {
  const [events, setEvents] = useState(sampleEvents);

  function removeEvent(eventId: number, eventName: string) {
    Alert.alert(
      "Remove event",
      `Are you sure you want to remove ${eventName}?`,
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
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={[
          styles.list,
          events.length === 0 && styles.emptyList,
        ]}
        data={events}
        keyExtractor={(event) => event.id.toString()}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>My events</Text>
            <Text style={styles.subtitle}>
              Events managed by your business account
            </Text>
          </View>
        }
        ListHeaderComponentStyle={styles.headerContainer}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <EventCard
              event={item}
              onPress={() =>
                navigation.navigate("Event", {
                  event: item,
                  fromMyEvents: true,
                })
              }
            />
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate("EditEvent", { event: item })
                }
              >
                <Text style={styles.actionButtonText}>Edit Event</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeEvent(item.id, item.name)}
              >
                <Text style={styles.actionButtonText}>Remove Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            You have not added any events yet.
          </Text>
        }
      />
      <StatusBar style="auto" />
    </View>
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
  headerContainer: {
    marginTop: -18,
    marginHorizontal: -18,
    marginBottom: 18,
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
  eventItem: {
    marginBottom: 14,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: -8,
    marginBottom: 14,
  },
  editButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6f01ff",
    borderRadius: 6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingVertical: 10,
  },
  removeButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d62828",
    borderRadius: 6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingVertical: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    color: "#77718a",
    fontSize: 16,
    textAlign: "center",
  },
});
