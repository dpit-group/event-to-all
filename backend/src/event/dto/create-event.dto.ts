import { EventType } from '../entities/eventType.entity';
import { MusicType } from '../entities/musicType.entity';
export interface CreateEventDto {
    name: string;
    city: string;
    eventType: EventType;
    musicType?: MusicType;
    description: string;
    address: string;
    lat: number;
    lng: number;
    startDate: Date;
    endDate?: Date;
    minAge?: number;
    artist?: string;
}
