import {
  PrimaryKey,
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany
} from 'sequelize-typescript';

import {CheckUser} from './CheckUser';
import {UserClient} from './UserClient';
import {ReservationOffice} from './ReservationOffice';
import {TypePositions} from './TypePositions';

@Table({timestamps: true, tableName: 'users'})
export class Users extends Model<Users> {
  @PrimaryKey
  @Column(DataType.STRING)
  public uid!: string;

  @Column(DataType.STRING)
  public slug!: string;

  @Column(DataType.STRING)
  fullName: string;

  @Column(DataType.STRING)
  public email!: string;

  @Column(DataType.STRING)
  public phone!: string;

  @Column(DataType.STRING)
  public position!: string;

  @Column(DataType.STRING)
  password: string;

  @Column(DataType.STRING)
  public linkedinProfile: string;

  @Column(DataType.STRING)
  public qrCode: string;

  @Column(DataType.STRING)
  public document: string;

  @Column(DataType.STRING)
  public profileImage: string;

  @ForeignKey(() => CheckUser)
  @Column(DataType.INTEGER)
  checkUserId: number;

  @ForeignKey(() => TypePositions)
  @Column(DataType.INTEGER)
  typePositionsId: number;

  @Column(DataType.STRING)
  public status: string;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  @DeletedAt
  readonly deletedAt: Date;

  // Relations
  @HasMany(() => UserClient)
  userClients: UserClient[];
}
