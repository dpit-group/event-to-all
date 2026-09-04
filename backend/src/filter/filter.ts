enum EventType {
Rock = "Rock",
  Rap = "Rap",
  Pop = "Pop",
  Jazz = "Jazz",
  Dance = "Dance",
  Movie = "Movie",
  Theater = "Theater"
}
enum minAge {
noage = 0,
  Age12 = 12,
  Age16 = 16,
  Age18 = 18
}
interface Filter {
  criteria: string;
  value: string;
}

import { Event } from "../event/entities/event.entity";

function filterEvents(events: Event[], filters: Filter[]): Event[] {
  return events.filter(event => {
    return filters.every(filter => {

      switch (filter.criteria) {

        case "city":
          return event.city.toLowerCase() === filter.value.toLowerCase();

        case "type":
          return event.type === filter.value;

        case "minAge":
          return event.minAge >= Number(filter.value);

        case "name":
          return event.name
            .toLowerCase()
            .includes(filter.value.toLowerCase());

        default:
          return true;
      }
    });