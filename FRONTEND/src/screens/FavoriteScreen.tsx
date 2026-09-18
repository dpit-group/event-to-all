import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { EventCard } from "../components/EventCard";
import { useFavorites } from "../context/FavoritesContext";
import type { FavoriteStackParamList } from "../navigation/RootNavigator";

type FavoriteScreenProps = NativeStackScreenProps<
  FavoriteStackParamList,
  "FavoriteMain"
>;

export function FavoriteScreen({ navigation, route }: FavoriteScreenProps) {
  const { favoriteEvents: events, removeFavorite } = useFavorites();

  useEffect(() => {
    const removedEventId = route.params?.removedEventId;
    if (removedEventId === undefined) {
      return;
    }

    removeFavorite(removedEventId);
    navigation.setParams({ removedEventId: undefined });
  }, [navigation, removeFavorite, route.params?.removedEventId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your favorites</Text>
        <Text style={styles.subtitle}>Events you saved for later</Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(event) => event.id.toString()}
        contentContainerStyle={[
          styles.list,
          events.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
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
