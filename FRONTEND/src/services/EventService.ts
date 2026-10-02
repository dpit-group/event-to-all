import { api } from "../api/client";
import type { Event } from "../dto/Events";

let event: Event[];

let nextId = 0;
function generateId(): string {
  return `event-${Date.now()}-${nextId++}`;
}
  class EventService {
private readonly path = "/event";

  async getAll(): Promise<Event[]> {
    console.log("Fetching all events from API");
    const { data } = await api.get<Event[]>(this.path);
    console.log("Received events from API:", data);
    return data;
    }

    async getById(id: string): Promise<Event> {
    const { data } = await api.get<Event>(`${this.path}/${id}`);
    return data;
    }

  async create(event: Event): Promise<Event> {
    const { data } = await api.post<Event>(this.path, event);
    return data;
  }
}

export const eventService = new EventService();