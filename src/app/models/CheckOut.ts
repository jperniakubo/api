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
  ForeignKey,
  BelongsTo,
  BelongsToMany
} from 'sequelize-typescript';

import {ReservationOffice} from './ReservationOffice';
import {Office} from './Office';
import {ImagesCheckOut} from './ImagesCheckOut';
import {ItemsCheckOut} from './ItemsCheckOut';
import {OfficeItems} from './OfficeItems';

@Table({timestamps: true, tableName: 'checkOut'})
export class CheckOut extends Model<CheckOut> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public comment!: string;

  @Column(DataType.INTEGER)
  public amountOfPeople!: number;

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

  @HasMany(() => ImagesCheckOut)
  imagesCheckOut: ImagesCheckOut[];

  @BelongsToMany(() => OfficeItems, () => ItemsCheckOut)
  OfficeItems: OfficeItems[];
}
