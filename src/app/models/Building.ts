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
  BelongsTo
} from 'sequelize-typescript';

import {City} from './City';
import {SystemPercentages} from './SystemPercentages';
import {FloorBuilding} from './FloorBuilding';

@Table({timestamps: true, tableName: 'building'})
export class Building extends Model<Building> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public name!: string;

  @Column(DataType.STRING)
  public description!: string;

  @Column(DataType.STRING)
  public numberOfFloors!: string;

  @Column(DataType.STRING)
  public status!: string;

  @Column(DataType.STRING)
  public address!: string;

  @Column(DataType.STRING)
  public comment!: string;

  @Column(DataType.STRING)
  public lat!: string;

  @Column(DataType.STRING)
  public long!: string;

  @Column(DataType.INTEGER)
  public minReservationCreationTime: number;

  @Column(DataType.INTEGER)
  public minReservationCancellationTime: number;

  @ForeignKey(() => City)
  @Column(DataType.INTEGER)
  public cityId!: number;

  @ForeignKey(() => SystemPercentages)
  @Column(DataType.INTEGER)
  public systemPercentageId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  readonly deletedAt!: Date;

  @BelongsTo(() => City)
  city: City;

  @HasMany(() => FloorBuilding)
  FloorBuilding: FloorBuilding[];

  @BelongsTo(() => SystemPercentages)
  systemPercentages: SystemPercentages;
}
