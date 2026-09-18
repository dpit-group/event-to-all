import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { randomUUID } from 'crypto';
import { EventResponseDto } from './dto/event-response.dto';
import { EventRepository } from './event.repository';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async create(createEventDto: CreateEventDto) {
    const event: Omit<Event, 'id'> = {
      name: createEventDto.name,
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
    };

    const savedEvent = await this.eventRepository.createEvent(event);

    return savedEvent;
  }
  async findAll(): Promise<EventResponseDto[]> {
    const events = await this.eventRepository.findAllEvents();
    return events;
  }

  async findOne(id: string): Promise<EventResponseDto> {
    const event = await this.eventRepository.findEventById(Number(id));
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    const event = await this.eventRepository.updateEvent(Number(id), {
      ...updateEventDto,
      startDate: updateEventDto.startDate
        ? new Date(updateEventDto.startDate)
        : undefined,
      endDate: updateEventDto.endDate
        ? new Date(updateEventDto.endDate)
        : undefined,
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async deleteEvent(id: string): Promise<string> {
    const deleted = await this.eventRepository.deleteEvent(Number(id));
    if (!deleted) {
      throw new NotFoundException('Event not found');
    }

    return 'Event deleted successfully ' + id;
  }

  remove(id: string): Promise<string> {
    return this.deleteEvent(id);
  }
}
