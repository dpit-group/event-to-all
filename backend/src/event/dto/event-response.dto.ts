import { EventType } from "../entities/eventType.entity";
import { MusicType } from "../entities/musicType.entity";

export interface EventResponseDto {
    id: number;
    name: string;
    eventType: EventType;
    musicType?: MusicType;
    description: string;
    city: string;
    address: string;
    lat: number;
    lng: number;
    startDate: Date;
    endDate?: Date;
    minAge?: number;
    artist?: string;
}