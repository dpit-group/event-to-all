import type { Event } from "../screens/EventScreen";
import { sampleEvents } from "./events";

export const sampleBoughtTickets: Event[] = sampleEvents.filter((event) =>
  [2, 5].includes(event.id),
);
