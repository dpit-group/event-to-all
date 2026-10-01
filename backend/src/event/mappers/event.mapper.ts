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
    background: createEventDto.background,
    icon: createEventDto.icon,
  });
}

export function mapEventToResponse(event: Event): EventResponseDto {
  return event.toJSON() as EventResponseDto;
}
