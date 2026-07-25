import { User } from '@core/auth/entities/user.entity';
import { Logger } from '@nestjs/common';
import { ApplicationRoles, GenderEnum } from '@shared/enums';
import { DataSource, Repository } from 'typeorm';

const owner = [
  {
    id: '7515fb90-7485-4ab4-8edf-ae07daf1d88e',
    phone: '09111111111',
    fullName: 'dear owner',
    gender: GenderEnum.MAN,
    role: ApplicationRoles.OWNER,
  },
];

export async function OwnerSeeder(dataSource: DataSource) {
  try {
    Logger.log('Seeding owner...', 'Nest Logger');

    const UserRepo: Repository<User> = dataSource.getRepository(User);

    await UserRepo.upsert(owner, { conflictPaths: {} });

    Logger.log('owner Seeded\n', 'Nest Logger');
    return;
  } catch (error) {
    Logger.error(error.message);
    return;
  }
}
