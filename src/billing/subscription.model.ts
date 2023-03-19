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

@Table({ tableName: 'subscriptions' })
export class Subscription extends Model {
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
  public stripeSubscriptionId: string;

  @Column({
    type: 'TIMESTAMP',
    allowNull: false,
    validate: {
      isDate: true,
    },
  })
  public nextBilling: Date;

  @Column({
    allowNull: false,
    defaultValue: false,
    validate: {
      isBoolean: true,
    },
  })
  public active: boolean;

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

  @CreatedAt
  public created: Date;

  @UpdatedAt
  public updated: Date;

  @DeletedAt
  public deleted: Date;
}
