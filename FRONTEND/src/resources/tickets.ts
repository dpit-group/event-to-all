import type { Event } from "../screens/EventScreen";
import { events } from "./GetAll";

export const sampleBoughtTickets: Event[] = events.filter((event) =>
  [2, 5].includes(event.id),
);
