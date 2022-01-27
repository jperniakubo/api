import {
  PrimaryKey,
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  HasMany,
  BelongsToMany,
  BelongsTo
} from 'sequelize-typescript';
import {CheckIn} from './CheckIn';
import {CheckOut} from './CheckOut';
import {ItemsCheckIn} from './ItemsCheckIn';
import {ItemsCheckOut} from './ItemsCheckOut';

import {Office} from './Office';
import {SystemItemIcons} from './SystemItemIcons';

@Table({timestamps: true, tableName: 'officeItems'})
export class OfficeItems extends Model<OfficeItems> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public name!: string;

  @ForeignKey(() => SystemItemIcons)
  @Column(DataType.INTEGER)
  public image!: number;

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

  @BelongsToMany(() => CheckOut, () => ItemsCheckOut)
  checkOut: CheckOut[];

  @BelongsToMany(() => CheckIn, () => ItemsCheckIn)
  checkIn: CheckIn[];

  @BelongsTo(() => SystemItemIcons)
  systemItemIcons: SystemItemIcons;
}
