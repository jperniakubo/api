import {
  PrimaryKey,
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt
} from 'sequelize-typescript';

import {Users} from './Users';

@Table({timestamps: true, tableName: 'userCodeVerification'})
export class UserCodeVerification extends Model<UserCodeVerification> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  public id!: string;

  @Column(DataType.STRING)
  public code!: string;

  @ForeignKey(() => Users)
  @Column(DataType.STRING)
  public uid!: string;

  @Column(DataType.STRING)
  public status: string;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  @DeletedAt
  readonly deletedAt: Date;

  // Relations
}
