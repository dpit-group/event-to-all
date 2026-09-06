import { Injectable } from '@nestjs/common';
import { Event } from './entities/event.entity';
import * as sqlite3 from 'sqlite3';
import { join } from 'path';

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
    join(process.cwd(), 'resources/database/event-to-all.db'),
  );

  createEvent(event: Omit<Event, 'id'>): Promise<Event> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO event
        (name, city, address, lat, lng, startDate, endDate, minAge, artist, background, icon)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          event.background ?? null,
          event.icon ?? null,
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

        resolve((rows as Array<Record<string, unknown>>).map(row => this.mapRow(row)));
      });
    });
  }

  findEventById(id: number): Promise<Event | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM event WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(row ? this.mapRow(row as Record<string, unknown>) : undefined);
      });
    });
  }

  updateEvent(id: number, event: Partial<Omit<Event, 'id'>>): Promise<Event | undefined> {
    const fields: Array<[string, unknown]> = [];
    if (event.name !== undefined) fields.push(['name', event.name]);
    if (event.city !== undefined) fields.push(['city', event.city]);
    if (event.address !== undefined) fields.push(['address', event.address]);
    if (event.lat !== undefined) fields.push(['lat', event.lat]);
    if (event.lng !== undefined) fields.push(['lng', event.lng]);
    if (event.startDate !== undefined) fields.push(['startDate', event.startDate.toISOString()]);
    if (event.endDate !== undefined) fields.push(['endDate', event.endDate.toISOString()]);
    if (event.minAge !== undefined) fields.push(['minAge', event.minAge]);
    if (event.artist !== undefined) fields.push(['artist', event.artist]);
    if (event.background !== undefined) fields.push(['background', event.background]);
    if (event.icon !== undefined) fields.push(['icon', event.icon]);

    return new Promise((resolve, reject) => {
      if (fields.length === 0) {
        this.findEventById(id).then(resolve, reject);
        return;
      }

      const columns = fields.map(([column]) => `${column} = ?`).join(', ');
      const values = fields.map(([, value]) => value);
      this.db.run(`UPDATE event SET ${columns} WHERE id = ?`, [...values, id], err => {
        if (err) {
          reject(err);
          return;
        }

        this.findEventById(id).then(resolve, reject);
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

  private mapRow(row: Record<string, unknown>): Event {
    return {
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
      background: row.background == null ? undefined : String(row.background),
      icon: row.icon == null ? undefined : String(row.icon),
    };
  }
}