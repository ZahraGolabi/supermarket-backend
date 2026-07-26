import { Controller, Get } from '@nestjs/common';
import { type JwtPayload } from '@shared/@types';
import { AuthorizeByRole, User } from '@shared/decorators';
import { ApplicationRoles } from '@shared/enums';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('me')
  @AuthorizeByRole([ApplicationRoles.ALL])
  async getMe(@User() user: JwtPayload) {
    return this.service.me(user.sub);
  }
}
