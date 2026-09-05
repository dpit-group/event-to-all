import { Event } from "../event/entities/event.entity";

export enum EventType {
  Rock = "Rock",
  Rap = "Rap",
  Pop = "Pop",
  Jazz = "Jazz",
  Dance = "Dance",
  Movie = "Movie",
  Theater = "Theater",
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
        default:
          return true;
      }
    }),
  );
}
