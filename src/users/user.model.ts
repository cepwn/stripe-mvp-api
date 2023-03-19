import {
  Column,
  CreatedAt,
  DeletedAt,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UUID, UUIDV4 } from 'sequelize';
import { Subscription } from '../billing/subscription.model';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'users' })
export class User extends Model {
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
  public stripeCustomerId: string;

  @ApiProperty()
  @Column({
    allowNull: false,
    validate: {
      isEmail: true,
    },
    unique: true,
  })
  public email: string;

  @ApiProperty()
  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  public password: string;

  @HasOne(() => Subscription)
  subscription: Subscription[];

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
