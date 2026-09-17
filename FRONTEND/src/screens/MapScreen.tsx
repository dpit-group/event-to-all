import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import MapView, { Callout, Marker } from "react-native-maps";
import type { MapStackParamList } from "../navigation/RootNavigator";
import { sampleEvents } from "../resources/events";

type MapScreenProps = NativeStackScreenProps<MapStackParamList, "MapMain">;

export function MapScreen({ navigation }: MapScreenProps) {
  const initialRegion = {
    latitude: sampleEvents[0]?.lat ?? 46.77,
    longitude: sampleEvents[0]?.lng ?? 23.5895,
    latitudeDelta: 2,
    longitudeDelta: 2,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {sampleEvents.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.lat,
              longitude: event.lng,
            }}
          >
            <Callout
              tooltip
              onPress={() => navigation.navigate("Event", { event })}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.calloutBox}
                onPress={() => navigation.navigate("Event", { event })}
              >
                <Text style={styles.calloutTitle}>{event.name}</Text>
                <Text style={styles.calloutText}>{event.city}</Text>
                <Text style={styles.calloutText}>{event.date}</Text>
              </TouchableOpacity>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  calloutBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    maxWidth: 180,
  },
  calloutTitle: {
    fontWeight: "700",
    color: "#1f2937",
    fontSize: 14,
    marginBottom: 4,
  },
  calloutText: {
    color: "#4b5563",
    fontSize: 12,
  },
});