import { EventType } from '../../filter/filter';
import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'event',
  timestamps: false,
})
export class Event extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column
  declare name: string;

  @Column({ type: DataType.TEXT })
  declare type: EventType;

  @Column
  declare city: string;

  @Column
  declare address: string;

  @Column({ type: DataType.REAL })
  declare lat: number;

  @Column({ type: DataType.REAL })
  declare lng: number;

  @Column({ type: DataType.DATE })
  declare startDate: Date;

  @Column({ type: DataType.DATE })
  declare endDate?: Date;

  @Column({ type: DataType.INTEGER })
  declare minAge?: number;

  @Column
  declare artist?: string;

  @Column
  declare background?: string;

  @Column
  declare icon?: string;
}
