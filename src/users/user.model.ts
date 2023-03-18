import {
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UUID, UUIDV4 } from 'sequelize';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  public id: string;

  @Column
  public stripeCustomerId: string;

  @Column
  public email: string;

  @Column
  public password: string;

  @CreatedAt
  public created: Date;

  @UpdatedAt
  public updated: Date;

  @DeletedAt
  public deleted: Date;
}
