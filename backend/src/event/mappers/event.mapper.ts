import { CreateEventDto } from '../dto/create-event.dto';
import { EventResponseDto } from '../dto/event-response.dto';
import { Event } from '../entities/event.entity';

export function mapCreateEventDtoToEntity(
  createEventDto: CreateEventDto,
): Event {
  return new Event({
    name: createEventDto.name,
    type: createEventDto.type,
    city: createEventDto.city,
    address: createEventDto.address,
    lat: createEventDto.lat,
    lng: createEventDto.lng,
    startDate: new Date(createEventDto.startDate),
    endDate: createEventDto.endDate
      ? new Date(createEventDto.endDate)
      : undefined,
    minAge: createEventDto.minAge,
    artist: createEventDto.artist,
    background: createEventDto.background
      ? toBuffer(createEventDto.background)
      : undefined,
    icon: createEventDto.icon ? toBuffer(createEventDto.icon) : undefined,
  });
}

export function mapEventToResponse(event: Event): EventResponseDto {
  const json = event.toJSON();
  return {
    ...json,
    background: toBase64(json.background),
    icon: toBase64(json.icon),
  } as EventResponseDto;
}

export function toBuffer(value: string): Buffer {
  return Buffer.from(value, 'base64');
}

export function toBase64(value: Buffer): string | undefined {
  return value ? Buffer.from(value).toString('base64') : undefined;
}

export function mapToEventResponseDtoArray(
  events: Event[],
): EventResponseDto[] {
  return events.map(mapEventToResponse);
}
