import { StatusBar } from "expo-status-bar";
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
import DateTimePicker from "@react-native-community/datetimepicker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { AccountStackParamList } from "../navigation/RootNavigator";
import { EventType } from "../dto/Events";
import { eventService } from "../services/EventService";

type AddEventScreenProps = NativeStackScreenProps<
  AccountStackParamList,
  "AddEvent"
>;

enum AgeLimit {
  AllAges = "0",
  TwelvePlus = "12",
  SixteenPlus = "16",
  EighteenPlus = "18",
}

const AGE_OPTIONS = Object.values(AgeLimit);
const EVENT_TYPES = Object.values(EventType);

export function AddEventScreen({ navigation }: AddEventScreenProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: "",
    type: EventType.Concerts,
    city: "",
    address: "",
    lng: "",
    lat: "",
    date: "",
    time: "",
    minAge: "" as AgeLimit | "",
    artist: "",
    image: "",
  });

  function updateEventForm<Field extends keyof typeof eventForm>(
    field: Field,
    value: (typeof eventForm)[Field],
  ) {
    setEventForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleAddEvent() {
    const latitude = Number(eventForm.lat);
    const longitude = Number(eventForm.lng);
    if (
      !eventForm.name.trim() ||
      !eventForm.city.trim() ||
      !eventForm.address.trim() ||
      !eventForm.date ||
      !eventForm.time ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      Alert.alert("Missing details", "Complete the event details before adding it.");
      return;
    }

    try {
      const endDate = selectedEndDate ? new Date(selectedEndDate) : undefined;
      if (endDate) {
        endDate.setHours(
          selectedEndTime?.getHours() ?? 0,
          selectedEndTime?.getMinutes() ?? 0,
          0,
          0,
        );
      }

      const createdEvent = await eventService.postEvent({
        name: eventForm.name.trim(),
        type: eventForm.type,
        city: eventForm.city.trim(),
        address: eventForm.address.trim(),
        lat: latitude,
        lng: longitude,
        startDate: selectedDate,
        endDate,
        minAge: eventForm.minAge === "" ? undefined : Number(eventForm.minAge),
        artist: eventForm.artist.trim() || undefined,
        background: eventForm.image.trim() || undefined,
      });

      Alert.alert(`${createdEvent.name} has been added`, undefined, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Could not add event", "Please check the details and try again.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Add event</Text>

        <View style={styles.groupContainer}>
          <Text style={styles.groupTitle}>Basic info</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={eventForm.name}
            onChangeText={(value) => updateEventForm("name", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Artist"
            value={eventForm.artist}
            onChangeText={(value) => updateEventForm("artist", value)}
          />
          <Text style={styles.fieldLabel}>Event type</Text>
          <View style={styles.eventTypeOptions}>
            {EVENT_TYPES.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.eventTypeOption,
                  eventForm.type === type && styles.ageOptionSelected,
                ]}
                onPress={() => updateEventForm("type", type)}
              >
                <Text
                  style={[
                    styles.eventTypeOptionText,
                    eventForm.type === type && styles.ageOptionTextSelected,
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={eventForm.image}
            onChangeText={(value) => updateEventForm("image", value)}
          />
        </View>

        <View style={styles.groupContainer}>
          <Text style={styles.groupTitle}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            value={eventForm.city}
            onChangeText={(value) => updateEventForm("city", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={eventForm.address}
            onChangeText={(value) => updateEventForm("address", value)}
          />
          <View style={styles.rowInputs}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Lng"
              value={eventForm.lng}
              onChangeText={(value) => updateEventForm("lng", value)}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Lat"
              value={eventForm.lat}
              onChangeText={(value) => updateEventForm("lat", value)}
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
                style={
                  eventForm.date ? styles.inputText : styles.placeholderText
                }
              >
                {eventForm.date || "Date"}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.input, styles.halfInput]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text
                style={
                  eventForm.time ? styles.inputText : styles.placeholderText
                }
              >
                {eventForm.time || "Time"}
              </Text>
            </Pressable>
          </View>
          <View style={styles.rowInputs}>
            <Pressable
              style={[styles.input, styles.halfInput]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text
                style={
                  selectedEndDate ? styles.inputText : styles.placeholderText
                }
              >
                {selectedEndDate
                  ? selectedEndDate.toLocaleDateString("en-GB")
                  : "End date (optional)"}
              </Text>
            </Pressable>
            <Pressable
              disabled={!selectedEndDate}
              style={[styles.input, styles.halfInput]}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text
                style={
                  selectedEndTime ? styles.inputText : styles.placeholderText
                }
              >
                {selectedEndTime
                  ? selectedEndTime.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hourCycle: "h23",
                    })
                  : "End time (optional)"}
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
                  updateEventForm("date", date.toLocaleDateString());
                }
              }}
            />
          )}
          {showEndDatePicker && (
            <DateTimePicker
              value={selectedEndDate ?? selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "compact" : "default"}
              accentColor="#6f01ff"
              themeVariant="light"
              onChange={(_, date) => {
                setShowEndDatePicker(false);
                if (date) {
                    setSelectedEndDate(date);
                }
              }}
            />
          )}
          {showEndTimePicker && selectedEndDate && (
            <DateTimePicker
              value={selectedEndTime ?? selectedEndDate}
              mode="time"
              display={Platform.OS === "ios" ? "compact" : "default"}
              accentColor="#6f01ff"
              themeVariant="light"
              onChange={(_, time) => {
                setShowEndTimePicker(false);
                if (time) {
                  setSelectedEndTime(time);
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
                  updateEventForm(
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
                  eventForm.minAge === age && styles.ageOptionSelected,
                ]}
                onPress={() => updateEventForm("minAge", age)}
              >
                <Text
                  style={[
                    styles.ageOptionText,
                    eventForm.minAge === age && styles.ageOptionTextSelected,
                  ]}
                >
                  {age}+
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleAddEvent}
        >
          <Text style={styles.primaryButtonText}>Add Event</Text>
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
  eventTypeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  eventTypeOption: {
    maxWidth: "48%",
    borderWidth: 1,
    borderColor: "#d2d2d2",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: "center",
  },
  eventTypeOptionText: {
    color: "#20233d",
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "center",
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
