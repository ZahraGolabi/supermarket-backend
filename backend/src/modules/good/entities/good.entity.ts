import { Brand } from '@core/brand/entities/brand.entity';
import { Category } from '@core/category/entities/category.entity';
import { BaseApplicationEntity } from '@shared/abstract';
import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['slug'])
@Index(['title', 'brandId', 'categoryId'])
@Index(['price', 'isAvailable'])
@Index(['createdAt'])
@Check(`"price" >= 0`)
@Check(`"stockQuantity" >= 0`)
@Check(`"discountPercent" >= 0 AND "discountPercent" <= 100`)
export class Good extends BaseApplicationEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @Index()
  title: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  slug: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  weightVolume: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  ingredients: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  barcode: string;

  @Column({
    type: 'bigint',
    nullable: false,
    default: 0,
    unsigned: true,
  })
  price: number;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
    unsigned: true,
  })
  discountPercent: number;

  @Column({
    type: 'boolean',
    nullable: true,
    default: true,
  })
  isAvailable: boolean;

  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
  })
  isFeatured: boolean;

  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
  })
  isHealthy: boolean;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  unit: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  @Index()
  brandId: string;

  @ManyToOne(() => Brand, (brand) => brand.goods, {
    onDelete: 'RESTRICT',
    eager: false,
  })
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  @Index()
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.goods, {
    onDelete: 'RESTRICT',
    eager: false,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
