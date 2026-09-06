import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as sqlite3 from 'sqlite3';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  private db = new sqlite3.Database(
    join(process.cwd(), 'resources/database/event-to-all.db'),
  );

  createUser(user: Omit<User, 'id'>): Promise<User> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO users
        (name, username, "phone number", email, password, bussiness)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      this.db.run(
        sql,
        [
          user.name,
          user.username,
          user.phoneNumber,
          user.email,
          user.password,
          user.isBusinessAccount ? 1 : 0,
        ],
        function (err) {
          if (err) {
            reject(err);
            return;
          }

          resolve({ ...user, id: this.lastID });
        },
      );
    });
  }

  findByUsernameOrEmail(usernameOrEmail: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
        [usernameOrEmail, usernameOrEmail],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(row ? this.mapRow(row as Record<string, unknown>) : undefined);
        },
      );
    });
  }

  private mapRow(row: Record<string, unknown>): User {
    return {
      id: Number(row.id),
      name: String(row.name),
      username: String(row.username),
      phoneNumber: String(row['phone number']),
      email: String(row.email),
      password: String(row.password),
      isBusinessAccount: Boolean(Number(row.bussiness)),
    };
  }
}
