import { eventService } from "../services/EventService";
import type { Event } from "../dto/Events";

export const events: Event[] = [];

eventService
  .getAll()
  .then((loadedEvents) => events.push(...loadedEvents))
  .catch((error: unknown) => {
    console.error("Could not load events:", error);
  });
  