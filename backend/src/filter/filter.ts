import { Event } from "../event/entities/event.entity";

export enum EventType {
  Clubs = "Clubs",
  Concerts = "Concerts",
  Festivals = "Festivals",
  Parties = "Parties",
  Cultural = "Cultural",
  ProductLaunch = "Product Launch",
}

export enum MinAge {
  NoAge = 0,
  Age12 = 12,
  Age16 = 16,
  Age18 = 18,
}

export interface Filter {
  criteria: string;
  value: string;
}

interface DistanceFilter {
  latitude: number;
  longitude: number;
  maxDistanceKm: number;
}

function distanceInKm(
  latitude: number,
  longitude: number,
  eventLatitude: number,
  eventLongitude: number,
): number {
  const earthRadiusKm = 6371;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDifference = toRadians(eventLatitude - latitude);
  const longitudeDifference = toRadians(eventLongitude - longitude);

  const value =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(latitude)) *
      Math.cos(toRadians(eventLatitude)) *
      Math.sin(longitudeDifference / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export function filterEvents(events: Event[], filters: Filter[]): Event[] {
  return events.filter((event) =>
    filters.every((filter) => {
      switch (filter.criteria) {
        case "city":
          return event.city.toLowerCase() === filter.value.toLowerCase();
        case "type":
          return (
            (event as Event & { type?: string }).type?.toLowerCase() ===
            filter.value.toLowerCase()
          );
        case "minAge":
          return (event.minAge ?? 0) >= Number(filter.value);
        case "name":
          return event.name.toLowerCase().includes(filter.value.toLowerCase());
        case "distance": {
          try {
            const distanceFilter = JSON.parse(filter.value) as DistanceFilter;

            if (
              !Number.isFinite(distanceFilter.latitude) ||
              !Number.isFinite(distanceFilter.longitude) ||
              !Number.isFinite(distanceFilter.maxDistanceKm)
            ) {
              return false;
            }

            return (
              distanceInKm(
                distanceFilter.latitude,
                distanceFilter.longitude,
                event.lat,
                event.lng,
              ) <= distanceFilter.maxDistanceKm
            );
          } catch {
            return false;
          }
        }
        default:
          return true;
      }
    }),
  );
}
