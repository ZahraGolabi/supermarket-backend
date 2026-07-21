import { Body, Controller, Post, Res } from '@nestjs/common';
import {
  accessTokenName,
  appCookieOptions,
  MaxAge_AcessToken,
  MaxAge_RefreshToken,
  refreshTokenName,
} from '@shared/constants';
import { setCookies } from '@shared/utils';
import { type Response } from 'express';
import { RegisterByPhoneDto } from '../dto/register-by-phone.dto';
import { VerifyByPhoneDto } from '../dto/verify-by-phone.dto';
import { AuthService } from '../services/auth.service';

@Controller('users')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register-by-phone')
  async registerByPhone(@Body() dto: RegisterByPhoneDto) {
    return await this.service.registerByPhone(dto);
  }

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
}
