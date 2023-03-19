import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { INTEGER, ENUM, UUID, UUIDV4 } from 'sequelize';
import { PriceInterval } from '../types';
import { Product } from './product.model';
import { Subscription } from '../../billing/subscription.model';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'prices' })
export class Price extends Model {
  @ApiProperty()
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

  @ApiProperty()
  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  public stripePriceId: string;

  @ApiProperty()
  @Column({
    allowNull: false,
    type: ENUM('month', 'year'),
    validate: {
      isIn: [['month', 'year']],
    },
  })
  public interval: PriceInterval;

  @ApiProperty()
  @Column({
    allowNull: false,
    type: INTEGER,
    validate: {
      isInt: true,
    },
  })
  public amount: number;

  @ApiProperty()
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

  @HasMany(() => Subscription)
  subscriptions: Subscription[];

  @ApiProperty()
  @CreatedAt
  public created: Date;

  @ApiProperty()
  @UpdatedAt
  public updated: Date;

  @ApiProperty({
    nullable: true,
  })
  @DeletedAt
  public deleted: Date;
}
