import { EventType } from '../../filter/filter';

export interface CreateEventDto {
    name: string;
    type: EventType;
    city: string;
    address: string;
    lat: number;
    lng: number;
    startDate: Date;
    endDate?: Date;
    minAge?: number;
    artist?: string;
}
