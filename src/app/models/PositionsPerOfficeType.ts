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

import {OfficeType} from './OfficeType';
import {Positions} from './Positions';

@Table({timestamps: true, tableName: 'positionsPerOfficeType'})
export class PositionsPerOfficeType extends Model<PositionsPerOfficeType> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Positions)
  @Column(DataType.INTEGER)
  public positionId!: number;

  @ForeignKey(() => OfficeType)
  @Column(DataType.INTEGER)
  public officeTypeId!: number;

  @Column(DataType.STRING)
  public status: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  readonly deletedAt!: Date;

  //Belong To

  // Relations
}
