import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import type { MapStackParamList } from "../navigation/RootNavigator";
import type { Event } from "../dto/Events";
import { useAppliedFilters } from "../context/AppliedFiltersContext";
import { eventService } from "../services/EventService";
import { getFiltered } from "./SearchScreen";

type MapScreenProps = NativeStackScreenProps<MapStackParamList, "MapMain">;

export function MapScreen({ navigation, route }: MapScreenProps) {
  const mapRef = useRef<MapView>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const {
    appliedFilters,
    showFilteredEvents,
    setShowFilteredEvents,
  } = useAppliedFilters();
  const focusedEvent = route.params?.event;

  useEffect(() => {
    let isActive = true;
    setEvents([]);

    (showFilteredEvents
      ? getFiltered(appliedFilters)
      : eventService.getAll())
      .then((loadedEvents) => {
        if (isActive) {
          setEvents(loadedEvents);
        }
      })
      .catch((error: unknown) => {
        console.error("Could not load events:", error);
        if (isActive) {
          Alert.alert("Could not load events", "Please try again later.");
        }
      });

    return () => {
      isActive = false;
    };
  }, [appliedFilters, showFilteredEvents]);

  const formatEventDate = (date: Date | string | undefined) => {
    const parsedDate = date instanceof Date ? date : new Date(date ?? "");

    if (!date || Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-GB");
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        if (focusedEvent && mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: focusedEvent.lat,
              longitude: focusedEvent.lng,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            },
            500,
          );
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (!isActive || !mapRef.current) {
          return;
        }

        mapRef.current.animateToRegion(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          },
          500,
        );
      })();

      return () => {
        isActive = false;
      };
    }, [focusedEvent]),
  );

  const initialRegion = {
    latitude: 46.77,
    longitude: 23.5895,
    latitudeDelta: 2,
    longitudeDelta: 2,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
      >
        {events.map((event) => (
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
                <Text style={styles.calloutText}>{formatEventDate(event.startDate)}</Text>
              </TouchableOpacity>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.eventToggle}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ selected: !showFilteredEvents }}
          onPress={() => setShowFilteredEvents(false)}
          style={[
            styles.eventToggleOption,
            !showFilteredEvents && styles.eventToggleOptionSelected,
          ]}
        >
          <Text
            style={[
              styles.eventToggleText,
              !showFilteredEvents && styles.eventToggleTextSelected,
            ]}
          >
            All Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ selected: showFilteredEvents }}
          onPress={() => setShowFilteredEvents(true)}
          style={[
            styles.eventToggleOption,
            showFilteredEvents && styles.eventToggleOptionSelected,
          ]}
        >
          <Text
            style={[
              styles.eventToggleText,
              showFilteredEvents && styles.eventToggleTextSelected,
            ]}
          >
            Filtered Events
          </Text>
        </TouchableOpacity>
      </View>
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
  eventToggle: {
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 4,
    flexDirection: "row",
    overflow: "hidden",
    position: "absolute",
    top: 16,
    zIndex: 1,
  },
  eventToggleOption: {
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  eventToggleOptionSelected: {
    backgroundColor: "#6f01ff",
  },
  eventToggleText: {
    color: "#3b2b6f",
    fontSize: 14,
    fontWeight: "700",
  },
  eventToggleTextSelected: {
    color: "#fff",
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
