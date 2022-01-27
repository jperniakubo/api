import {
  PrimaryKey,
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt
} from 'sequelize-typescript';
import {Building} from './Building';
@Table({timestamps: true, tableName: 'systemPercentages'})
export class SystemPercentages extends Model<SystemPercentages> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.INTEGER)
  public percent!: number;

  @Column(DataType.STRING)
  public percentText!: string;

  @Column(DataType.STRING)
  public status: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  readonly deletedAt!: Date;

  @HasMany(() => Building)
  building: Building[];
}
