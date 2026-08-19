import { Injectable } from '@nestjs/common';
import { event_list } from './repositories/repository';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  get_list_events(): Event[] {
    return event_list;
  }
}
