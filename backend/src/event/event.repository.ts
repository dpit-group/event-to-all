import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventRepository {
    Events: Event[] = [
        {
            id: randomUUID
            Name: Zi de nastere Ionut ;
            City: Cluj-Napoca;
            Address: La Ionut Acasa ;
            StartingDate: 32.15.2027;
            StartingTime: 19:20 ;
            FinishDate: cand ne da afara;
            MinAge: 12;
            Artist: Fuego;
        },
        {
            id: randomUUID;
            Name: Party de Craciun;
            City: Cluj-Napoca
            Address: Centrul Vechi;
            StartingDate: 24.12.2027
            StartingTime: 20:00;
            FinishDate: 25.12.2027;
            FinishTime: 12:00;
            MinAge: 16;
            Artist: Colindatorii;
        },
    ];
}