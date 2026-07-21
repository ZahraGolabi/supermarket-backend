import { ApplicationRoles } from '@shared/enums';

export interface JwtPayload {
  sub: string;
  role: ApplicationRoles;
}
