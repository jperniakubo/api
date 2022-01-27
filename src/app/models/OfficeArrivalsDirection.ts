import {
  PrimaryKey,
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey
} from 'sequelize-typescript';

import {Office} from './Office';

@Table({timestamps: true, tableName: 'officeArrivalsDirection'})
export class OfficeArrivalsDirection extends Model<OfficeArrivalsDirection> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public description!: string;

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
}
