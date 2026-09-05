import { EventType } from './eventType.entity';
import { MusicType } from './musicType.entity';

export interface Event {
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
