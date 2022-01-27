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

import {BoAdmin} from './BoAdmin';

@Table({timestamps: true, tableName: 'logPwdAdmin'})
export class LogPwdAdmin extends Model<LogPwdAdmin> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.DATE)
  public date!: Date;

  @Column(DataType.STRING)
  public status!: string;

  @ForeignKey(() => BoAdmin)
  @Column(DataType.INTEGER)
  public boAdminId!: number;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  readonly deletedAt!: Date;
}
