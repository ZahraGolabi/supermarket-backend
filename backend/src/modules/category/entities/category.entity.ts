import { Good } from '@core/good/entities/good.entity';
import { BaseApplicationEntity } from '@shared/abstract';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Category extends BaseApplicationEntity {
  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Good, (good) => good.category)
  goods: Good[];
}
