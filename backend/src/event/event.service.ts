import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { randomUUID } from 'crypto';
import { EventResponseDto } from './dto/event-response.dto';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository
  ) {
  }
  create(createEventDto: CreateEventDto) {
    return {
      id: randomUUID(),
      name: createEventDto.name,
      city: createEventDto.city,
      address: createEventDto.address,
      startDate: createEventDto.startDate,
      endDate: createEventDto.endDate,
      minAge: createEventDto.minAge,
      artist: createEventDto.artist,
    }
  }

  findAll() {
    return [new EventResponseDto()];
  }

  findOne(id: string): EventResponseDto {
    return new EventResponseDto();
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return new EventResponseDto();
  }

  remove(id: string) {
    return "Event removed successfully " + id;
  }
}
