import { Injectable } from '@nestjs/common'; 
import { CreateEventDto } from './dto/create-event.dto'; 
import { UpdateEventDto } from './dto/update-event.dto'; 
import { randomUUID } from 'crypto'; 
import { EventResponseDto } from './dto/event-response.dto'; 
import { EventRepository } from './event.repository'; 
import { Event } from './entities/event.entity'; 
 
@Injectable() 
export class EventService { 
  constructor( 
    private readonly eventRepository: EventRepository 
  ) { 
  } 
 
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
    }; 
 
    const savedEvent = await this.eventRepository.createEvent(event); 
 
    this.eventRepository.Events.push(savedEvent); 
 
    return savedEvent; 
  } 
  async findAll(): Promise<EventResponseDto[]> {
    const events = await this.eventRepository.findAllEvents();
    this.eventRepository.Events = events;
    return events;
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
 
  async deleteEvent(id: string): Promise<string> {
    const deleted = await this.eventRepository.deleteEvent(Number(id));
    if (!deleted) {
      throw new Error(`Event not found`);
    }

    this.eventRepository.Events = this.eventRepository.Events.filter(
      event => event.id !== Number(id),
    );
    return "Event deleted successfully " + id;
  }

  remove(id: string): Promise<string> {
    return this.deleteEvent(id);
  }
}