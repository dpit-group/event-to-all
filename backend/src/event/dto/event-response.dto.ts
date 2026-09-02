export class EventResponseDto {
    id!: string;
    name!: string;
    city!: string;
    address!: string;
    lat!: number;
    lng!: number;
    startDate!: Date;
    endDate?: Date;
    minAge?: number;
    artist?: String;
}