import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { EventCard } from "../components/EventCard";
import { sampleEvents } from "../resources/events";
type AppliedFilters = {
  startDate: string | null;
  endDate: string | null;
  distance: number;
  types: string[];
  ageLimit?: string;
};

export function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const [activeFilters, setActiveFilters] = useState<AppliedFilters | null>(
    null,
  );
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const filteredEvents = sampleEvents.filter((event) => {
    const query = searchText.trim().toLowerCase();
    return (
      !query ||
      event.name.toLowerCase().includes(query) ||
      event.city.toLowerCase().includes(query) ||
      event.artist?.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const filters = route.params?.appliedFilters ?? null;
    setActiveFilters(filters);
  }, [route.params]);

  const handleClearFilters = () => {
    setActiveFilters(null);
    navigation.setParams({ appliedFilters: null });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredEvents}
        keyExtractor={(event) => event.id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponentStyle={styles.listHeader}
        ListHeaderComponent={
          <View>
            <View style={styles.searchRow}>
              <TextInput
                style={styles.input}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search"
                placeholderTextColor="#8a8a8a"
                autoCapitalize="words"
              />

              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => undefined}
              >
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filterButton}
                onPress={() =>
                  navigation.navigate("Filter", {
                    currentFilters: activeFilters ?? {
                      startDate: null,
                      endDate: null,
                      distance: 2,
                      types: ["Concerts"],
                      ageLimit: "0+",
                    },
                  })
                }
              >
                <Text style={styles.filterButtonText}>Filters</Text>
              </TouchableOpacity>
            </View>

            {activeFilters && (
              <View style={styles.filterSummary}>
                <Text style={styles.filterSummaryText}>Active filters</Text>
                <View style={styles.filterChipRow}>
                  {activeFilters.types.map((type) => (
                    <View key={type} style={styles.filterChip}>
                      <Text style={styles.filterChipText}>{type}</Text>
                    </View>
                  ))}
                  <View style={styles.filterChip}>
                    <Text style={styles.filterChipText}>
                      {activeFilters.distance} km
                    </Text>
                  </View>
                  {activeFilters.startDate && (
                    <View style={styles.filterChip}>
                      <Text style={styles.filterChipText}>
                        Start: {activeFilters.startDate}
                      </Text>
                    </View>
                  )}
                  {activeFilters.endDate && (
                    <View style={styles.filterChip}>
                      <Text style={styles.filterChipText}>
                        End: {activeFilters.endDate}
                      </Text>
                    </View>
                  )}
                  {activeFilters.ageLimit && (
                    <View style={styles.filterChip}>
                      <Text style={styles.filterChipText}>
                        {activeFilters.ageLimit}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.clearFilterChip}
                    onPress={handleClearFilters}
                    accessibilityRole="button"
                    accessibilityLabel="Clear filters"
                  >
                    <Text style={styles.clearFilterChipText}>X</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
            showFavorite
            onPress={() => navigation.navigate("Event", { event: item })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No events match your search.</Text>
        }
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  list: {
    paddingBottom: 18,
  },
  listHeader: {
    marginBottom: 12,
  },
  emptyText: {
    color: "#77718a",
    fontSize: 16,
    padding: 24,
    textAlign: "center",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#1d1d1d",
    backgroundColor: "#fff",
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: "#ece6ff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  filterButton: {
    backgroundColor: "#6f01ff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#1d1d1d",
    fontSize: 14,
    fontWeight: "600",
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  filterSummary: {
    marginTop: 12,
    backgroundColor: "#f0ebff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterSummaryText: {
    color: "#3b2b6f",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  filterChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#6f01ff",
    backgroundColor: "#6f01ff",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  filterChipText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  clearFilterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#6f01ff",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  clearFilterChipText: {
    color: "#6f01ff",
    fontSize: 13,
    fontWeight: "700",
  },
});
