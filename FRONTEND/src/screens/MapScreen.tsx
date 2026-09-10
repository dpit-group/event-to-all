import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export  function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 46.7700,
          longitude: 23.5895,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker
          coordinate={{
            latitude: 46.7700,
            longitude: 23.5895,
          }}
          title="Cluj-Napoca"
          description="My location"
        />
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
});