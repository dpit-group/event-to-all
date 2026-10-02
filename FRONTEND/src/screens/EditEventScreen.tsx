import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from "@react-native-community/datetimepicker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";


import type {
  AccountStackParamList,
  MyEventsStackParamList,
} from "../navigation/RootNavigator";
import type { Event } from "../dto/Events";
import { formatEventDate } from "../services/ParseDateString";
import { eventService } from "../services/EventService";
type EditEventProps =
  | NativeStackScreenProps<AccountStackParamList, "EditEvent">
  | NativeStackScreenProps<MyEventsStackParamList, "EditEvent">;

enum AgeLimit {
  AllAges = "0",
  TwelvePlus = "12",
  SixteenPlus = "16",
  EighteenPlus = "18",
}

const AGE_OPTIONS = Object.values(AgeLimit);

type EventDraft = {
  name: string;
  city: string;
  address: string;
  lng: string;
  lat: string;
  date: string;
  time: string;
  minAge: AgeLimit | "";
  artist: string;
  background: string;
};

const originalEvent: EventDraft = {
  name: "Electric Garden",
  city: "Bucharest",
  address: "Strada Izvor 12",
  lng: "26.1025",
  lat: "44.4268",
  date: "12 October 2026",
  time: "20:00",
  minAge: AgeLimit.EighteenPlus,
  artist: "The Midnight Club",
  background:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
};

function toEventDraft(event?: Event): EventDraft {
  if (!event) {
    return originalEvent;
  }

  const formattedStartDate = formatEventDate(event.startDate);
  const [date, time] =
    formattedStartDate === "Date unavailable"
      ? ["", ""]
      : formattedStartDate.split(" at ");

  return {
    name: event.name,
    city: event.city,
    address: event.address,
    lng: String(event.lng),
    lat: String(event.lat),
    date,
    time,
    minAge: event.minAge === undefined ? "" : String(event.minAge) as AgeLimit,
    artist: event.artist ?? "",
    background: typeof event.background === "string" ? event.background : "",
  };
}

export function EditEventScreen({ navigation, route }: EditEventProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const startDate = route.params?.event?.startDate;
    const parsedDate = startDate ? new Date(startDate) : new Date();
    return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [event, setEvent] = useState(() => toEventDraft(route.params?.event));

  function updateEvent<Field extends keyof EventDraft>(
    field: Field,
    value: EventDraft[Field],
  ) {
    setEvent((current) => ({ ...current, [field]: value }));
  }

  async function confirmEdits() {
    const original = route.params?.event;
    if (!original) {
      Alert.alert("Could not update event", "No event was selected.");
      return;
    }

    const latitude = Number(event.lat);
    const longitude = Number(event.lng);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      Alert.alert("Invalid location", "Enter valid latitude and longitude values.");
      return;
    }

    try {
      const updatedEvent = await eventService.patchEvent(original.id, {
        name: event.name.trim(),
        city: event.city.trim(),
        address: event.address.trim(),
        lat: latitude,
        lng: longitude,
        startDate: selectedDate,
        minAge: event.minAge === "" ? undefined : Number(event.minAge),
        artist: event.artist.trim() || undefined,
        background: event.background.trim() || undefined,
      });

      Alert.alert("Event updated", `${updatedEvent.name} was updated.`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Could not update event", "Please check the details and try again.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Edit event</Text>

        <View style={styles.groupContainer}>
          <Text style={styles.groupTitle}>Basic info</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={event.name}
            onChangeText={(value) => updateEvent("name", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Artist"
            value={event.artist}
            onChangeText={(value) => updateEvent("artist", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Background URL"
            value={event.background}
            onChangeText={(value) => updateEvent("background", value)}
          />
        </View>

        <View style={styles.groupContainer}>
          <Text style={styles.groupTitle}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            value={event.city}
            onChangeText={(value) => updateEvent("city", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={event.address}
            onChangeText={(value) => updateEvent("address", value)}
          />
          <View style={styles.rowInputs}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Lng"
              value={event.lng}
              onChangeText={(value) => updateEvent("lng", value)}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Lat"
              value={event.lat}
              onChangeText={(value) => updateEvent("lat", value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.groupContainer}>
          <Text style={styles.groupTitle}>Schedule & restrictions</Text>
          <View style={styles.rowInputs}>
            <Pressable
              style={[styles.input, styles.halfInput]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={event.date ? styles.inputText : styles.placeholderText}
              >
                {event.date || "Date"}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.input, styles.halfInput]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text
                style={event.time ? styles.inputText : styles.placeholderText}
              >
                {event.time || "Time"}
              </Text>
            </Pressable>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "compact" : "default"}
              accentColor="#6f01ff"
              themeVariant="light"
              onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) {
                  setSelectedDate(date);
                  updateEvent("date", date.toLocaleDateString());
                }
              }}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display={Platform.OS === "ios" ? "compact" : "default"}
              accentColor="#6f01ff"
              themeVariant="light"
              onChange={(_, time) => {
                setShowTimePicker(false);
                if (time) {
                  setSelectedDate(time);
                  updateEvent(
                    "time",
                    time.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  );
                }
              }}
            />
          )}
          <Text style={styles.fieldLabel}>Minimum age</Text>
          <View style={styles.ageOptions}>
            {AGE_OPTIONS.map((age) => (
              <Pressable
                key={age}
                style={[
                  styles.ageOption,
                  event.minAge === age && styles.ageOptionSelected,
                ]}
                onPress={() => updateEvent("minAge", age)}
              >
                <Text
                  style={[
                    styles.ageOptionText,
                    event.minAge === age && styles.ageOptionTextSelected,
                  ]}
                >
                  {age}+
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={confirmEdits}>
          <Text style={styles.primaryButtonText}>Confirm edits</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 24,
    paddingBottom: 40,
  },
  formContainer: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 18,
    color: "#20233d",
  },
  groupContainer: {
    width: "100%",
    marginBottom: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#efe7ff",
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6f01ff",
    marginBottom: 10,
  },
  rowInputs: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d2d2d2",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  inputText: {
    color: "#1d1d1d",
    fontSize: 16,
  },
  placeholderText: {
    color: "#8a8a8a",
    fontSize: 16,
  },
  fieldLabel: {
    color: "#6f01ff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  ageOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ageOption: {
    width: "23%",
    borderWidth: 1,
    borderColor: "#d2d2d2",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
  },
  ageOptionSelected: {
    backgroundColor: "#6f01ff",
    borderColor: "#6f01ff",
  },
  ageOptionText: {
    color: "#20233d",
    fontSize: 16,
    fontWeight: "600",
  },
  ageOptionTextSelected: {
    color: "#fff",
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#6f01ff",
    borderRadius: 6,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
