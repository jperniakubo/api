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
  BelongsTo,
  BelongsToMany,
  ForeignKey
} from 'sequelize-typescript';

import {ReservationOffice} from './ReservationOffice';
import {Office} from './Office';
import {ImagesCheckIn} from './ImagesCheckIn';
import {ItemsCheckIn} from './ItemsCheckIn';
import {OfficeItems} from './OfficeItems';

@Table({timestamps: true, tableName: 'checkIn'})
export class CheckIn extends Model<CheckIn> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public comment!: string;

  @Column(DataType.INTEGER)
  public amountOfPeople: number;

  @ForeignKey(() => ReservationOffice)
  @Column(DataType.INTEGER)
  public reservationId!: number;

  @ForeignKey(() => Office)
  @Column(DataType.INTEGER)
  public officeId!: number;

  @Column(DataType.STRING)
  public status: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  readonly deletedAt!: Date;

  @BelongsTo(() => ReservationOffice)
  reservationOffice: ReservationOffice[];

  @HasMany(() => ImagesCheckIn)
  imagesCheckIn: ImagesCheckIn[];

  @HasMany(() => ItemsCheckIn)
  itemsCheckIn: ItemsCheckIn[];

  @BelongsToMany(() => OfficeItems, () => ItemsCheckIn)
  OfficeItems: OfficeItems[];
}
