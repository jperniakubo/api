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

import {Users} from './Users';

@Table({timestamps: true, tableName: 'userTicketHelpCenter'})
export class UserTicketHelpCenter extends Model<UserTicketHelpCenter> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public name!: string;

  @ForeignKey(() => Users)
  @Column(DataType.STRING)
  public uid!: string;

  @Column(DataType.STRING)
  public status: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  readonly deletedAt!: Date;
}
