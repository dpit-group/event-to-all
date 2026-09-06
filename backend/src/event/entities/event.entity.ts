export interface Event {
    id: number;
    name: string;
    city: string;
    address: string;
    lat: number;
    lng: number;
    startDate: Date;
    endDate?: Date;
    minAge?: number;
    artist?: string;
    background?: string;
    icon?: string;
}
