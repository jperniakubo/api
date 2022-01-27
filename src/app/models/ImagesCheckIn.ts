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

import {CheckIn} from './CheckIn';

@Table({timestamps: true, tableName: 'imagesCheckIn'})
export class ImagesCheckIn extends Model<ImagesCheckIn> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public image!: string;

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
}
