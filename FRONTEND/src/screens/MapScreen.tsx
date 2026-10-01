import React, { useCallback, useRef } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import type { MapStackParamList } from "../navigation/RootNavigator";
import { sampleEvents } from "../resources/events";

type MapScreenProps = NativeStackScreenProps<MapStackParamList, "MapMain">;

export function MapScreen({ navigation, route }: MapScreenProps) {
  const mapRef = useRef<MapView>(null);
  const focusedEvent = route.params?.event;

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
    latitude: sampleEvents[0]?.lat ?? 46.77,
    longitude: sampleEvents[0]?.lng ?? 23.5895,
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
