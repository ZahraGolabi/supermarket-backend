import { Category } from '@core/category/entities/category.entity';
import { BaseApplicationEntity } from '@shared/abstract';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
@Index(['name', 'categoryId'], { unique: true })
export class Brand extends BaseApplicationEntity {
  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column()
  categoryId: string;

  @ManyToOne(() => Category, {
    onDelete: 'RESTRICT',
    eager: false,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
