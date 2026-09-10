import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: false,
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column
  declare name: string;

  @Column
  declare username: string;

  @Column({ field: 'phone number', type: DataType.TEXT })
  declare phoneNumber: string;

  @Column
  declare email: string;

  @Column
  declare password: string;

  @Column({ field: 'bussiness', type: DataType.INTEGER })
  declare isBusinessAccount: boolean;
}