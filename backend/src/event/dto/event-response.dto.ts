export class EventResponseDto {
    id!: string;
    name!: string;
    city!: String;
    address!: String;
    startDate!: Date;
    endDate?: Date;
    minAge?: number;
    artist?: String;
}