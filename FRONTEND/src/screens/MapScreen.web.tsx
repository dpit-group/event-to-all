import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Event } from "../dto/Events";
import { useAppliedFilters } from "../context/AppliedFiltersContext";
import { eventService } from "../services/EventService";
import { getFiltered } from "./SearchScreen";

const markerIcon = L.divIcon({
  html: '<div style="font-size: 30px;">📍</div>',
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export function MapScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadError, setLoadError] = useState(false);
  const {
    appliedFilters,
    showFilteredEvents,
    setShowFilteredEvents,
  } = useAppliedFilters();

  useEffect(() => {
    let isActive = true;
    setEvents([]);
    setLoadError(false);

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
          setLoadError(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, [appliedFilters, showFilteredEvents]);

  return (
    <>
      <MapContainer
        center={[46.77, 23.5895]}
        zoom={13}
        style={{ width: "100vw", height: "100vh" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
            icon={markerIcon}
          >
            <Popup>
              <strong>{event.name}</strong>
              <br />
              {event.city}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div
        role="group"
        aria-label="Choose which events to show"
        style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          display: "flex",
          left: "50%",
          overflow: "hidden",
          position: "absolute",
          top: 16,
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        {(["All Events", "Filtered Events"] as const).map((label) => {
          const isFiltered = label === "Filtered Events";
          const isSelected = showFilteredEvents === isFiltered;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setShowFilteredEvents(isFiltered)}
              style={{
                backgroundColor: isSelected ? "#6f01ff" : "#fff",
                border: 0,
                color: isSelected ? "#fff" : "#3b2b6f",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 700,
                padding: "11px 14px",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      {loadError ? (
        <div
          role="alert"
          style={{
            backgroundColor: "#fff",
            color: "#b42318",
            left: 16,
            padding: 12,
            position: "absolute",
            top: 16,
            zIndex: 1000,
          }}
        >
          Could not load events. Please try again later.
        </div>
      ) : null}
    </>
  );
}