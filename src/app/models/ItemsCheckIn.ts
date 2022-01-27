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

import {OfficeItems} from './OfficeItems';
import {CheckIn} from './CheckIn';

@Table({timestamps: true, tableName: 'itemsCheckIn'})
export class ItemsCheckIn extends Model<ItemsCheckIn> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.INTEGER)
  public checked!: number;

  @ForeignKey(() => OfficeItems)
  @Column(DataType.INTEGER)
  public officeItemId!: number;

  @ForeignKey(() => CheckIn)
  @Column(DataType.INTEGER)
  public checkInId!: number;

  @Column(DataType.STRING)
  public status: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  readonly deletedAt!: Date;

  @BelongsTo(() => CheckIn)
  checkIn: CheckIn[];

  @BelongsTo(() => OfficeItems)
  officeItems: OfficeItems[];
}
