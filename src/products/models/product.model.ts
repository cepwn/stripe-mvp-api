import {
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UUID, UUIDV4 } from 'sequelize';
import { Price } from './price.model';

@Table({ tableName: 'products' })
export class Product extends Model {
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
  public stripeProductId: string;

  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  public name: string;

  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  public features: string;

  @Column({
    allowNull: false,
    defaultValue: false,
    validate: {
      isBoolean: true,
    },
  })
  public active: boolean;

  @Column({
    allowNull: false,
    defaultValue: false,
    validate: {
      isBoolean: true,
    },
  })
  public mostPopular: boolean;

  @Column({
    allowNull: false,
    defaultValue: false,
    validate: {
      isBoolean: true,
    },
  })
  public trial: boolean;

  @HasMany(() => Price)
  price: Price[];

  @CreatedAt
  public created: Date;

  @UpdatedAt
  public updated: Date;

  @DeletedAt
  public deleted: Date;
}
