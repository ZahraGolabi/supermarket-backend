import { BaseApplicationEntity } from '@shared/abstract';
import { Column, Entity } from 'typeorm';

@Entity()
export class Category extends BaseApplicationEntity {
  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description: string;
}
