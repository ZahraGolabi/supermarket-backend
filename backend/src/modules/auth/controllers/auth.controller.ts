import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  accessTokenName,
  appCookieOptions,
  MaxAge_AcessToken,
  MaxAge_RefreshToken,
  refreshTokenName,
} from '@shared/constants';
import { Cookie } from '@shared/decorators';
import { PublicEndPoint } from '@shared/decorators/skip-auth.decorator';
import { setCookies } from '@shared/utils';
import { type Response } from 'express';
import { RegisterByPhoneDto } from '../dto/register-by-phone.dto';
import { VerifyByPhoneDto } from '../dto/verify-by-phone.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @PublicEndPoint()
  @Post('register-by-phone')
  async registerByPhone(@Body() dto: RegisterByPhoneDto) {
    return await this.service.registerByPhone(dto);
  }

  @PublicEndPoint()
  @Post('verify-by-phone')
  async verifyByPhone(
    @Body() dto: VerifyByPhoneDto,
    @Res() response: Response,
  ) {
    const { accessToken, refreshToken } = await this.service.verifyByPhone(dto);

    setCookies(response, [
      {
        name: accessTokenName,
        value: accessToken,
        options: appCookieOptions(MaxAge_AcessToken),
      },
      {
        name: refreshTokenName,
        value: refreshToken,
        options: appCookieOptions(MaxAge_RefreshToken),
      },
    ]);

    console.log(accessToken, refreshToken);

    return response.status(200).json({ success: true });
  }

  @Post('refresh-token')
  @PublicEndPoint()
  @ApiOkResponse({ type: Boolean })
  async refreshToken(
    @Cookie(refreshTokenName) refreshToken: string,
    @Res() response: Response,
  ) {
    if (!refreshToken)
      throw new UnauthorizedException('refresh-token not found');

    const { accessToken } = await this.service.refreshToken(refreshToken);

    setCookies(response, [
      {
        name: accessTokenName,
        value: accessToken,
        options: {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: MaxAge_RefreshToken,
        },
      },
    ]);

    response.json({ success: true });
  }
}
