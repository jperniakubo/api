import {
  PrimaryKey,
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany
} from 'sequelize-typescript';

import {OfficeItems} from './OfficeItems';

@Table({timestamps: true, tableName: 'systemItemIcons'})
export class SystemItemIcons extends Model<SystemItemIcons> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  public svg!: string;

  @Column(DataType.STRING)
  public png!: string;

  @Column(DataType.STRING)
  public status: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;

  @DeletedAt
  readonly deletedAt!: Date;

  @HasMany(() => OfficeItems)
  officeItems: OfficeItems[];
}
