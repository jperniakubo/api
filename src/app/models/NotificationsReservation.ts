import {
  PrimaryKey,
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
  HasOne,
  ForeignKey
} from 'sequelize-typescript';

import {Users} from './Users';
import {ReservationOffice} from './ReservationOffice';

@Table({timestamps: true, tableName: 'notificationsReservation'})
export class NotificationsReservation extends Model<NotificationsReservation> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public message!: string;

  @ForeignKey(() => Users)
  @Column(DataType.STRING)
  public uid!: string;

  @ForeignKey(() => ReservationOffice)
  @Column(DataType.INTEGER)
  public reservationId!: number;

  @Column(DataType.STRING)
  public type!: string;

  @Column(DataType.STRING)
  public status!: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  readonly deletedAt!: Date;
}
