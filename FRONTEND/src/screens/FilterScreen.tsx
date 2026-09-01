import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@react-native-vector-icons/ionicons";

const EVENT_TYPES = ["Clubs", "Concerts", "Festivals", "Parties", "Cultural", "Product Launch"] as const;
type EventType = (typeof EVENT_TYPES)[number];

const DEFAULT_FILTERS = {
  date: null as Date | null,
  distance: 5,
  selectedTypes: [] as EventType[],
};

export function FilterScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const savedFilters = route.params?.currentFilters ?? DEFAULT_FILTERS;

  const parseDateFromString = (value: string | null) => {
    if (!value) return null;

    const [day, month, year] = value.split("/").map(Number);
    if (!day || !month || !year) return null;

    return new Date(year, month - 1, day);
  };

  const [date, setDate] = useState<Date | null>(parseDateFromString(savedFilters.date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [distance, setDistance] = useState<number>(savedFilters.distance ?? DEFAULT_FILTERS.distance);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [sliderOffsetX, setSliderOffsetX] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>(
    savedFilters.types ?? DEFAULT_FILTERS.selectedTypes
  );

  const updateDistanceFromPosition = (pageX?: number) => {
    if (!Number.isFinite(pageX) || sliderWidth === 0) {
      return;
    }

    const relativePosition = Math.max(0, (pageX ?? 0) - sliderOffsetX);
    const safePosition = Math.min(relativePosition, sliderWidth);
    const nextDistance = (safePosition / sliderWidth) * 25;

    setDistance(Math.round(nextDistance));
  };

  const toggleType = (type: EventType) => {
    setSelectedTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type]
    );
  };

  const handleDistanceChange = (positionX?: number) => {
    updateDistanceFromPosition(positionX);
  };

  const formatDate = (value: Date | null) => {
    if (!value) {
      return "Select date";
    }

    return value.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleOpenDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleApplyFilters = () => {
    const selectedTypeText =
      selectedTypes.length > 0 ? selectedTypes.join(", ") : "None";

    navigation.navigate("SearchMain", {
      appliedFilters: {
        date: date ? formatDate(date) : null,
        distance,
        types: selectedTypes,
      },
    });

    /*Alert.alert(
      "Filters applied",
      `Date: ${date ? formatDate(date) : "Any date"}\nDistance: ${distance} km\nTypes: ${selectedTypeText}`
    );
    */
  };

  const handleResetFilters = () => {
    setDate(DEFAULT_FILTERS.date);
    setDistance(DEFAULT_FILTERS.distance);
    setSelectedTypes([...DEFAULT_FILTERS.selectedTypes]);
  };

  const handleGoBack = () => {
    navigation.navigate("SearchMain", { appliedFilters: null });
  };

  const fillWidth = `${(Math.min(Math.max(distance, 0), 25) / 25) * 100}%` as any;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={20} color="#3b2b6f" />
          </Pressable>
          <Text style={styles.title}>Filter events</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.typeGrid}>
          {EVENT_TYPES.map((type) => {
            const isSelected = selectedTypes.includes(type);

            return (
              <Pressable
                key={type}
                onPress={() => toggleType(type)}
                style={[styles.typeButton, isSelected && styles.typeButtonSelected]}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    isSelected && styles.typeButtonTextSelected,
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Date</Text>

        <Pressable style={styles.dateButton} onPress={handleOpenDatePicker}>
          <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
        </Pressable>

        {showDatePicker && (
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={date ?? new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "compact" : "default"}
              accentColor="#6f01ff"
              themeVariant="light"
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);

                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Location</Text>
        <Text style={styles.distanceText}>{distance} km from you</Text>

        <View
          style={styles.sliderTrack}
          onLayout={(event) => {
            const { width, x } = event.nativeEvent.layout;
            setSliderWidth(width);
            setSliderOffsetX(x);
          }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={(event) =>
            handleDistanceChange(event.nativeEvent.pageX)
          }
          onResponderMove={(event) =>
            handleDistanceChange(event.nativeEvent.pageX)
          }
        >
          <View style={[styles.sliderFill, { width: fillWidth as any }]} />
          <View style={styles.sliderBase} />
          <View
            style={[
              styles.thumb,
              {
                left: fillWidth as any,
              },
            ]}
          />
        </View>

        <View style={styles.sliderLabelsRow}>
          <Text style={styles.sliderLabel}>0 km</Text>
          <Text style={styles.sliderLabel}>25 km</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.primaryButton} onPress={handleApplyFilters}>
          <Text style={styles.primaryButtonText}>Apply</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={handleResetFilters}>
          <Text style={styles.secondaryButtonText}>Reset filter</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f6f3ff",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 32,
  },
  headerRow: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1d1d1d",
    flexShrink: 1,
  },
  
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1d1d1d",
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: "#f5f2ff",
    borderColor: "#e4ddff",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#1d1d1d",
  },
  datePickerContainer: {
    marginTop: 12,
    backgroundColor: "#f8f5ff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#d9d1ff",
  },
  distanceText: {
    color: "#5a34d6",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  sliderTrack: {
    height: 42,
    justifyContent: "center",
  },
  sliderBase: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#e8e2ff",
  },
  sliderFill: {
    position: "absolute",
    left: 0,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#6f01ff",
  },
  thumb: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderColor: "#6f01ff",
    borderWidth: 3,
    marginLeft: -12,
    top: 9,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  sliderLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  sliderLabel: {
    color: "#555",
    fontSize: 12,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  typeButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d9d1ff",
    backgroundColor: "#f7f4ff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  typeButtonSelected: {
    backgroundColor: "#6f01ff",
    borderColor: "#6f01ff",
  },
  typeButtonText: {
    color: "#3f2a7a",
    fontWeight: "600",
    fontSize: 14,
    textTransform: "capitalize",
  },
  typeButtonTextSelected: {
    color: "#ffffff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#6f01ff",
    borderRadius: 14,
    paddingVertical: 14,
    marginRight: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#f0ebff",
    borderRadius: 14,
    paddingVertical: 14,
    marginLeft: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#3b2b6f",
    fontWeight: "700",
    fontSize: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#f0ebff",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#3b2b6f",
    fontWeight: "700",
    fontSize: 22,
    lineHeight: 22,
  },
});
