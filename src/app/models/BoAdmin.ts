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
  ForeignKey
} from 'sequelize-typescript';

import {RoleAdmin} from './RoleAdmin';

@Table({timestamps: true, tableName: 'boAdmin'})
export class BoAdmin extends Model<BoAdmin> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public fullName!: string;

  @Column(DataType.STRING)
  public email!: string;

  @Column(DataType.STRING)
  public password!: string;

  @Column(DataType.STRING)
  public documentType!: string;

  @Column(DataType.STRING)
  public document!: string;

  @Column(DataType.STRING)
  public position!: string;

  @Column(DataType.STRING)
  public profileImage!: string;

  @Column(DataType.STRING)
  public phoneNumber!: string;

  @Column(DataType.STRING)
  public firstLogin: string;

  @ForeignKey(() => RoleAdmin)
  @Column(DataType.INTEGER)
  public roleAdminId!: number;

  @Column(DataType.STRING)
  public status: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  readonly deletedAt!: Date;
}
