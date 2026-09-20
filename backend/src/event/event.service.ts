import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { EventRepository } from './event.repository';
import { filterEvents, Filter } from '../filter/filter';
import {
  mapCreateEventDtoToEntity,
  mapEventToResponse,
} from './mappers/event.mapper';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async create(createEventDto: CreateEventDto): Promise<EventResponseDto> {
    const savedEvent = await this.eventRepository.createEvent(createEventDto);
    return mapEventToResponse(savedEvent);
  }
  async findAll(): Promise<EventResponseDto[]> {
    const events = await this.eventRepository.findAllEvents();
    return events.map(mapEventToResponse);
  }

  async findEventbyFilters(filters: Filter[]): Promise<EventResponseDto[]> {
    const events = await this.eventRepository.findAllEvents();
    return filterEvents(events, filters).map(mapEventToResponse);
  }

  async findOne(id: string): Promise<EventResponseDto> {
    const event = await this.eventRepository.findEventById(Number(id));
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return mapEventToResponse(event);
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
    return mapEventToResponse(event);
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
