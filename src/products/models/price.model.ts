import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { INTEGER, ENUM, UUID, UUIDV4 } from 'sequelize';
import { PriceInterval } from '../types';
import { Product } from './product.model';

@Table({ tableName: 'prices' })
export class Price extends Model {
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
  public stripePriceId: string;

  @Column({
    allowNull: false,
    type: ENUM('month', 'year'),
    validate: {
      isIn: [['month', 'year']],
    },
  })
  public interval: PriceInterval;

  @Column({
    allowNull: false,
    type: INTEGER,
    validate: {
      isInt: true,
    },
  })
  public amount: number;

  @ForeignKey(() => Product)
  @Column({
    allowNull: false,
    type: UUID,
    validate: {
      isUUID: 4,
    },
  })
  public productId: string;

  @BelongsTo(() => Product)
  product: Product;

  @CreatedAt
  public created: Date;

  @UpdatedAt
  public updated: Date;

  @DeletedAt
  public deleted: Date;
}
