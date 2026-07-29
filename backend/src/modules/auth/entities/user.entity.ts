import { BaseApplicationEntity } from '@shared/abstract';
import { ApplicationRoles, GenderEnum } from '@shared/enums';
import { Column, Entity, Index } from 'typeorm';

@Entity()
export class User extends BaseApplicationEntity {
  @Column({ length: 100, nullable: true })
  @Index()
  firstName?: string;

  @Column({ length: 100, nullable: true })
  @Index()
  lastName?: string;

  fullName?: string;

  @Column({ length: 11, unique: true, nullable: true })
  phone?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({
    type: 'enum',
    enum: ApplicationRoles,
    default: ApplicationRoles.USER,
  })
  role: ApplicationRoles;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    nullable: true,
  })
  gender?: GenderEnum;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @Column({ nullable: true })
  refreshToken?: string;
}
