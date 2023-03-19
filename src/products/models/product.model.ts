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
import { Subscription } from '../../billing/subscription.model';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'products' })
export class Product extends Model {
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
  public stripeProductId: string;

  @ApiProperty()
  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  public name: string;

  @ApiProperty()
  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  public features: string;

  @ApiProperty()
  @Column({
    allowNull: false,
    defaultValue: false,
    validate: {
      isBoolean: true,
    },
  })
  public active: boolean;

  @ApiProperty()
  @Column({
    allowNull: false,
    defaultValue: false,
    validate: {
      isBoolean: true,
    },
  })
  public mostPopular: boolean;

  @ApiProperty({
    type: () => [Price],
  })
  @HasMany(() => Price)
  prices: Price[];

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
