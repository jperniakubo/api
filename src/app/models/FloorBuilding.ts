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

import {Office} from './Office';
import {Building} from './Building';

@Table({timestamps: true, tableName: 'floorBuilding'})
export class FloorBuilding extends Model<FloorBuilding> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public floor!: string;

  @Column(DataType.STRING)
  public status: string;

  @ForeignKey(() => Building)
  @Column(DataType.INTEGER)
  public buildingId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  readonly deletedAt!: Date;

  @HasMany(() => Office)
  office: Office[];

  @BelongsTo(() => Building)
  building: Building[];
}
