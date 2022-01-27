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

import {Users} from './Users';
import {Office} from './Office';

@Table({timestamps: true, tableName: 'usersFavoritesOffices'})
export class UsersFavoritesOffices extends Model<UsersFavoritesOffices> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public status: string;

  @ForeignKey(() => Users)
  @Column(DataType.STRING)
  public uid!: string;

  @ForeignKey(() => Office)
  @Column(DataType.INTEGER)
  public officeId!: number;
}
