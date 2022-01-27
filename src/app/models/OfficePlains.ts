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

import {Office} from './../models/Office';

@Table({timestamps: true, tableName: 'officePlains'})
export class OfficePlains extends Model<OfficePlains> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public image!: string;

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
