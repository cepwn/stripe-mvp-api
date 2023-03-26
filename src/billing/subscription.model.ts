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
import { UUID, UUIDV4 } from 'sequelize';
import { User } from '../users/user.model';
import { Price } from '../products/models/price.model';
import { Product } from '../products/models/product.model';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'subscriptions' })
export class Subscription extends Model {
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
  public stripeSubscriptionId: string;

  @ApiProperty()
  @Column({
    type: 'TIMESTAMP',
    allowNull: false,
    validate: {
      isDate: true,
    },
  })
  public currentPeriodEnd: Date;

  @ApiProperty()
  @Column({
    type: 'TIMESTAMP',
    allowNull: false,
    validate: {
      isDate: true,
    },
  })
  public currentPeriodStart: Date;

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
  public initialEnrollment: boolean;

  @ApiProperty({ nullable: true })
  @Column({
    allowNull: true,
    validate: {
      notEmpty: true,
    },
  })
  public cardName: string;

  @ApiProperty({ nullable: true })
  @Column({
    allowNull: true,
    validate: {
      notEmpty: true,
    },
  })
  public cardLast4: string;

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

  @ApiProperty()
  @ForeignKey(() => Price)
  @Column({
    allowNull: false,
    type: UUID,
    validate: {
      isUUID: 4,
    },
  })
  public priceId: string;

  @BelongsTo(() => Price)
  price: Price;

  @ApiProperty()
  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: UUID,
    validate: {
      isUUID: 4,
    },
  })
  public userId: string;

  @BelongsTo(() => User)
  user: User;

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
