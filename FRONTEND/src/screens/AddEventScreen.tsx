import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export function AddEventScreen() {
  const [eventForm, setEventForm] = useState({
    name: "",
    city: "",
    address: "",
    lng: "",
    lat: "",
    date: "",
    time: "",
    minAge: "",
    artist: "",
    image: "",
  });

  function updateEventForm(field: keyof typeof eventForm, value: string) {
    setEventForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleAddEvent() {
    const fields = Object.values(eventForm);
    const hasEmptyField = fields.some((value) => !value.trim());

    if (hasEmptyField) {
      return;
    }

    console.log("New event added", eventForm);
    setEventForm({
      name: "",
      city: "",
      address: "",
      lng: "",
      lat: "",
      date: "",
      time: "",
      minAge: "",
      artist: "",
      image: "",
    });
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
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Date"
              value={eventForm.date}
              onChangeText={(value) => updateEventForm("date", value)}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Time"
              value={eventForm.time}
              onChangeText={(value) => updateEventForm("time", value)}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Min age"
            value={eventForm.minAge}
            onChangeText={(value) => updateEventForm("minAge", value)}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleAddEvent}>
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
