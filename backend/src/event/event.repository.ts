import { Injectable } from '@nestjs/common';
import { Event } from './entities/event.entity';
import { EventType } from './entities/eventType.entity';
import { MusicType } from './entities/musicType.entity';

@Injectable()
export class EventRepository {
    Events: Event[] = [
    {
        id: 1,
        name: 'Movie Night',
        eventType: EventType.MOVIE,
        description: 'An outdoor screening of a classic movie.',
        city: 'Cluj-Napoca',
        address: 'Parcul Central',
        lat: 46.7678,
        lng: 23.5751,
        startDate: new Date('2026-09-15T20:30:00'),
        endDate: new Date('2026-09-15T23:00:00'),
        minAge: 16,
     },
     {
        id: 2,
        name: 'Summer Party',
        eventType: EventType.FESTIVAL,
        musicType: MusicType.RAP,
        description: 'A summer party with live DJs and dancing.',
        city: 'Cluj-Napoca',
        address: 'Strada Memorandumului 10',
        lat: 46.7712,
        lng: 23.6236,
        startDate: new Date('2026-09-12T20:00:00'),
        endDate: new Date('2026-09-13T02:00:00'),
        minAge: 18,
        artist: 'DJ Alex',
     },
    ];
}