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
import {BoAdmin} from './BoAdmin';
@Table({timestamps: true, tableName: 'logActions'})
export class LogActions extends Model<LogActions> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public action!: string;

  @Column(DataType.STRING)
  public table!: string;

  @Column(DataType.STRING)
  public rowId!: string;

  @ForeignKey(() => BoAdmin)
  @Column(DataType.INTEGER)
  public boAdminId!: number;

  @Column(DataType.STRING)
  public status: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  readonly deletedAt!: Date;
}
