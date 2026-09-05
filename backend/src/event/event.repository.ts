import { Injectable } from '@nestjs/common';
import { Event } from './entities/event.entity';
import * as sqlite3 from 'sqlite3';

@Injectable()
export class EventRepository {

  Events: Event[] = [
    {
      id: 1,
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
      id: 2,
      name: 'Tech Conference 2026',
      city: 'Cluj-Napoca',
      address: 'BT Arena, Strada Uzinei Electrice',
      lat: 46.7671,
      lng: 23.5703,
      startDate: new Date('2026-09-10T09:00:00'),
      endDate: new Date('2026-09-11T17:00:00'),
      minAge: 16,
      artist: 'Various Speakers',
    },
    {
      id: 3,
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
      id: 4,
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
      id: 5,
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

  private db = new sqlite3.Database(
    'C:\\Users\\User\\OneDrive\\Desktop\\sqlite\\sqlite-tools-win-x64-3530400\\event-to-all.db'
  );

  createEvent(event: Omit<Event, 'id'>): Promise<Event> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO event
        (name, city, address, lat, lng, startDate, endDate, minAge, artist)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      this.db.run(
        sql,
        [
          event.name,
          event.city,
          event.address,
          event.lat,
          event.lng,
          event.startDate.toISOString(),
          event.endDate ? event.endDate.toISOString() : null,
          event.minAge,
          event.artist ?? null,
        ],
        function (err) {
          if (err) {
            reject(err);
            return;
          }

          resolve({
            ...event,
            id: this.lastID,
          });
        },
      );
    });
  }

  findAllEvents(): Promise<Event[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM event ORDER BY id', [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve((rows as Array<Record<string, unknown>>).map(row => ({
          id: Number(row.id),
          name: String(row.name),
          city: String(row.city),
          address: String(row.address),
          lat: Number(row.lat),
          lng: Number(row.lng),
          startDate: new Date(String(row.startDate)),
          endDate: row.endDate ? new Date(String(row.endDate)) : undefined,
          minAge: row.minAge == null ? undefined : Number(row.minAge),
          artist: row.artist == null ? undefined : String(row.artist),
        })));
      });
    });
  }

  deleteEvent(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM event WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.changes > 0);
      });
    });
  }
}