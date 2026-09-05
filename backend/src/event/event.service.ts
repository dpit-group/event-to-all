import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { randomUUID } from 'crypto';
import { EventResponseDto } from './dto/event-response.dto';
import { EventRepository } from './event.repository';
import { Event } from './entities/event.entity';
import { filterEvents, Filter } from '../filter/filter';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository
  ) {
  }
  create(createEventDto: CreateEventDto) {
    const event: Event = {       
      id: Math.floor(Math.random() * 1000), 
      name: createEventDto.name,
      type: createEventDto.type,
      city: createEventDto.city,
      address: createEventDto.address,
      lat: createEventDto.lat,
      lng: createEventDto.lng,
      startDate: createEventDto.startDate,
      endDate: createEventDto.endDate,
      minAge: createEventDto.minAge,
      artist: createEventDto.artist,
    }
    this.eventRepository.Events.push(event);
    return event;
  }
  findAll(filters: Filter[] = []) {
    return filterEvents(this.eventRepository.Events, filters);
  }

  findOne(id: string): EventResponseDto {
    const event = this.eventRepository.Events.find(event => event.id === Number(id));
    if (!event) {
      throw new Error(`Event not found`);
    }
    return event;
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    const event = this.eventRepository.Events.find(event => event.id === Number(id));
    if (!event) {
      throw new Error(`Event not found`);
    }
    Object.assign(event, updateEventDto);
    return event;
  }

  remove(id: string): string {
    const event = this.eventRepository.Events.find(event => event.id === Number(id));
    if (!event) {
      throw new Error(`Event not found`);
    }
    this.eventRepository.Events = this.eventRepository.Events.filter(e => e.id !== Number(id));
    return "Event removed successfully " + id;
  }
}
