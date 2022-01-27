import {
  PrimaryKey,
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsTo,
  HasMany,
  HasOne,
  ForeignKey
} from 'sequelize-typescript';

import {Users} from './Users';
import {Office} from './Office';
import {CheckIn} from './CheckIn';
import {CheckOut} from './CheckOut';

@Table({timestamps: true, tableName: 'reservationOffice'})
export class ReservationOffice extends Model<ReservationOffice> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.DATE)
  public date!: Date;

  @Column(DataType.STRING)
  public startTime!: string;

  @Column(DataType.STRING)
  public endTime!: string;

  @Column(DataType.STRING)
  public status!: string;

  @Column(DataType.STRING)
  public leadReservationUid: string;

  @ForeignKey(() => Users)
  @Column(DataType.STRING)
  public uid!: string;

  @ForeignKey(() => Office)
  @Column(DataType.INTEGER)
  public officeId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  readonly deletedAt!: Date;

  //belongs

  @BelongsTo(() => Office)
  office: Office[];

  @BelongsTo(() => Users)
  users: Users[];

  //relations
  @HasMany(() => CheckIn)
  checkIn: CheckIn[];

  @HasMany(() => CheckOut)
  checkOut: CheckOut[];
  /*
  @HasOne(() => Office)
  office: Office; */
}
