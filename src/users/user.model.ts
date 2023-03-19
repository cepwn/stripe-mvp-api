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
    validate: {
      isUUID: 4,
    },
  })
  public id: string;

  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  public stripeCustomerId: string;

  @Column({
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  public email: string;

  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  public password: string;

  @CreatedAt
  public created: Date;

  @UpdatedAt
  public updated: Date;

  @DeletedAt
  public deleted: Date;
}
