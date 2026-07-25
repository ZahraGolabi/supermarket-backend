import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '@shared/constants/tokens';
import { ApplicationRoles } from '@shared/enums';

export const AuthorizeByRole = (roles: ApplicationRoles[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
