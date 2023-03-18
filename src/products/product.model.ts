import {
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UUID, UUIDV4 } from 'sequelize';

@Table({ tableName: 'products' })
export class Product extends Model {
  @Column({
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  public id: string;

  @Column
  public stripeProductId: string;

  @Column
  public name: string;

  @Column
  public features: string;

  @Column
  public active: boolean;

  @Column
  public mostPopular: boolean;

  @Column
  public trial: boolean;

  @CreatedAt
  public created: Date;

  @UpdatedAt
  public updated: Date;

  @DeletedAt
  public deleted: Date;
}
