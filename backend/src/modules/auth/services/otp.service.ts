import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '@shared/providers';
import { Hash } from '@shared/utils';

@Injectable()
export class OtpService {
  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    // private readonly smsService : SmsProvider ,
  ) {}

  async sendOtpToPhone(phone: string) {
    const otp = this.generateOtp();

    await this.cacheService.set(`phone:${phone}`, otp, 120);

    if (this.configService.get<string>('NODE_ENV') === 'production') {
      //   await this.smsService.sendOtpToPhone({ code: otp, reciver: phone });
      return {
        message: 'otp sent to your phone',
      };
    }
    return {
      message: 'otp sent to your phone',
      otp,
    };
  }

  async sendOtpToEmail(email: string) {
    const otp = this.generateOtp();

    await this.cacheService.set(`email:${email}`, await Hash(otp), 120);

    if (this.configService.get<string>('NODE_ENV') === 'production') {
      //   await this.smsService.sendOtpToEmail({ code: otp, reciver: email });
      return {
        message: 'otp sent to your email',
      };
    }
    return {
      message: 'otp sent to your email',
      otp,
    };
  }

  generateOtp(): string {
    let otp = '';
    for (let i = 0; i < 5; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }
}
