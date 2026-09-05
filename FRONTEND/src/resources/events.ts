import type { Event } from "../screens/EventScreen";

export const sampleEvents: Event[] = [
  {
    id: 1,
    name: "Electric Garden",
    city: "Bucharest",
    address: "Strada Izvor 12",
    lat: 44.4268,
    lng: 26.1025,
    date: "12 October 2026",
    time: "20:00",
    minAge: 18,
    artist: "The Midnight Club",
    imageUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Rooftop Sessions",
    city: "Cluj-Napoca",
    address: "Calea Moților 8",
    lat: 46.7712,
    lng: 23.6236,
    date: "24 October 2026",
    time: "19:30",
    minAge: 16,
    artist: "Luna Echo",
    imageUrl:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80",
  },
];
