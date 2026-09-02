import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventRepository {
    Events: Event[] = [
     {
        id: '1',
        name: 'Summer Music Festival',
        city: 'Bucharest',
        address: 'Arena Națională, Strada Maior Coravu 2',
        lat: 44.439663,
        lng: 26.096306,
        startDate: new Date('2026-07-15T18:00:00'),
        endDate: new Date('2026-07-15T23:59:59'),
        minAge: 18,
        artist: 'The Motans',
    },
    {
        id: '2',
        name: 'Tech Conference 2026',
        city: 'Cluj-Napoca',
        address: 'BT Arena, Strada Uzinei Electrice',
        lat: 46.7671,
        lng: 23.5703,
        startDate: new Date('2026-09-10t09:00:00'),
        endDate: new Date('2026-09-11t17:00:00'),
        minAge: 16,
        artist: 'Various Speakers',
    },
    {
        id: '3',
        name: 'Jazz in the Park',
        city: 'Cluj-Napoca',
        address: 'Central Park',
        lat: 46.7712,
        lng: 23.6236,
        startDate: new Date('2026-06-20'),
        endDate: new Date('2026-06-21'),
        minAge: 12,
        artist: 'Nicolas Simion',
    },
    {
        id: '4',
        name: 'Rock Night',
        city: 'Timișoara',
        address: 'Iulius Congress Hall',
        lat: 45.7418,
        lng: 21.2331,
        startDate: new Date('2026-10-05'),
        endDate: new Date('2026-10-05'),
        minAge: 18,
        artist: 'Alternosfera',
    },
    {
        id: '5',
        name: 'Food & Wine Festival',
        city: 'Brașov',
        address: 'Piața Sfatului',
        lat: 45.6580,
        lng: 25.6012,
        startDate: new Date('2026-08-22'),
        endDate: new Date('2026-08-23'),
        minAge: 18,
    },
    ];
}