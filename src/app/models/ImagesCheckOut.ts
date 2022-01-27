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
  BelongsTo,
  HasOne,
  ForeignKey
} from 'sequelize-typescript';

import {CheckOut} from './CheckOut';

@Table({timestamps: true, tableName: 'imagesCheckOut'})
export class ImagesCheckOut extends Model<ImagesCheckOut> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public image!: string;

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

  @BelongsTo(() => CheckOut)
  checkOut: CheckOut[];
}
