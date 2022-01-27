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
  BelongsToMany,
  HasMany,
  HasOne,
  ForeignKey
} from 'sequelize-typescript';

import {OfficeItems} from './OfficeItems';
import {CheckOut} from './CheckOut';

@Table({timestamps: true, tableName: 'itemsCheckOut'})
export class ItemsCheckOut extends Model<ItemsCheckOut> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.INTEGER)
  public checked!: number;

  @ForeignKey(() => OfficeItems)
  @Column(DataType.INTEGER)
  public officeItemId!: number;

  @ForeignKey(() => CheckOut)
  @Column(DataType.INTEGER)
  public checkOutId!: number;

  @Column(DataType.STRING)
  public status: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  readonly deletedAt!: Date;
}
