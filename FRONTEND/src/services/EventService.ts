import { api } from "../api/client";
import * as Location from "expo-location";
import type { Event } from "../dto/Events";
import type { AppliedFilters } from "../dto/AppliedFilters";

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

  async getFilteredEvents(filters: AppliedFilters | null): Promise<Event[]> {
    console.log("Fetching filtered events from API");
    const params: Record<string, string> = {};
    if (filters?.types.length) {
      params.type = filters.types.join(",");
    }
    if (filters?.startDate) {
      params.startDate = filters.startDate;
    }
    if (filters?.endDate) {
      params.endDate = filters.endDate;
    }
    const minimumAge = Number.parseInt(filters?.ageLimit ?? "", 10);
    if (Number.isFinite(minimumAge) && minimumAge > 0) {
      params.minAge = String(minimumAge);
    }

    //get the location from the user if the distance filter is set
    if (filters) {
      if (!Number.isFinite(filters.distance) || filters.distance < 0) {
        throw new Error("Distance filter must be a non-negative number");
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission is required to filter by distance");
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      params.distance = String(filters.distance);
      params.latitude = String(position.coords.latitude);
      params.longitude = String(position.coords.longitude);
    }

    const { data } = await api.get<Event[]>(`${this.path}/filters`, {
      params,
    });
    console.log("Received filtered events from API:", data);
    return data;
  }
  async deleteEvent(eventId: number): Promise<void> {
    await api.delete(`${this.path}/${eventId}`);
  }
  async postEvent(
    event: Omit<Event, "id" | "background"> & { background?: string },
  ): Promise<Event> {
    const { data } = await api.post<Event>(this.path, event);
    return data;
  }
  async patchEvent(
    eventId: number,
    event: Partial<Omit<Event, "id" | "background">> & {
      background?: string;
    },
  ): Promise<Event> {
    const { data } = await api.patch<Event>(`${this.path}/${eventId}`, event);
    return data;
  }
}

export const eventService = new EventService();