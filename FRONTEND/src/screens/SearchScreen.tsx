import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

type AppliedFilters = {
  date: string | null;
  distance: number;
  types: string[];
};

export function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const [activeFilters, setActiveFilters] = useState<AppliedFilters | null>(null);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  useEffect(() => {
    const filters = route.params?.appliedFilters ?? null;
    setActiveFilters(filters);
  }, [route.params]);

  return (
    <View style={styles.container}>
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
          onPress={() => {
            //vedem noi dupa
          }}
        >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() =>
            navigation.navigate("Filter", {
              currentFilters: activeFilters ?? {
                date: null,
                distance: 5,
                types: ["Concerts"],
              },
            })
          }
        >
          <Text style={styles.buttonText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {activeFilters && (
        <View style={styles.filterSummary}>
          <Text style={styles.filterSummaryText}>
            Active filters:{" "}
            {activeFilters.types.length ? activeFilters.types.join(", ") : ""}
            {activeFilters.types.length ? ` • ${activeFilters.distance} km` : `${activeFilters.distance} km`}
            {activeFilters.date ? ` • ${activeFilters.date}` : ""}
          </Text>
        </View>
      )}

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
  },
});
