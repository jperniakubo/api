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
  BelongsTo
} from 'sequelize-typescript';

import {City} from './City';
import {Building} from './Building';
import {OfficeType} from './OfficeType';
import {OfficeImages} from './OfficeImages';
import {OfficeItems} from './OfficeItems';
import {OfficePlains} from './OfficePlains';
import {OfficeArrivalsDirection} from './OfficeArrivalsDirection';
import {FloorBuilding} from './FloorBuilding';
import {UsersFavoritesOffices} from './UsersFavoritesOffices';

@Table({timestamps: true, tableName: 'office'})
export class Office extends Model<Office> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public name!: string;

  @Column(DataType.STRING)
  public description!: string;

  @Column(DataType.INTEGER)
  public maxCapacity!: number;

  @Column(DataType.STRING)
  public durationCheckIn!: string;

  @Column(DataType.STRING)
  public durationCheckOut!: string;

  @Column(DataType.STRING)
  public qrCode!: string;

  @ForeignKey(() => City)
  @Column(DataType.INTEGER)
  public cityId!: number;

  @ForeignKey(() => Building)
  @Column(DataType.INTEGER)
  public buildingId!: number;

  @ForeignKey(() => OfficeType)
  @Column(DataType.INTEGER)
  public officeTypeId!: number;

  @ForeignKey(() => FloorBuilding)
  @Column(DataType.INTEGER)
  public floorBuildingId!: number;

  @Column(DataType.STRING)
  public status: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  readonly deletedAt!: Date;

  //Belong To

  @BelongsTo(() => Building)
  building: Building[];

  @BelongsTo(() => FloorBuilding)
  floorBuilding: FloorBuilding[];

  @BelongsTo(() => City)
  city: City[];

  @BelongsTo(() => OfficeType)
  officeType: OfficeType[];

  // Relations
  @HasMany(() => OfficeImages)
  officeImages: OfficeImages[];

  @HasMany(() => OfficePlains)
  officePlains: OfficePlains[];

  @HasMany(() => OfficeItems)
  officeItems: OfficeItems[];

  @HasMany(() => OfficeArrivalsDirection)
  officeArrivalDirection: OfficeArrivalsDirection[];
}
