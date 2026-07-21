// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { CacheService } from '@shared/providers';
// import { Repository } from 'typeorm';
// import { RegisterByPhoneDto } from '../dto/register-by-phone.dto';
// import { VerifyByPhoneDto } from '../dto/verify-by-phone.dto';
// import { User } from '../entities/user.entity';
// import { JwtAppService } from './jwt.service';
// import { OtpService } from './otp.service';

import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationRoles } from '@shared/enums';
import { CacheService } from '@shared/providers';
import { Compare } from '@shared/utils';
import { Repository } from 'typeorm';
import { RegisterByPhoneDto } from '../dto/register-by-phone.dto';
import { VerifyByPhoneDto } from '../dto/verify-by-phone.dto';
import { User } from '../entities/user.entity';
import { JwtAppService } from './jwt.service';
import { OtpService } from './otp.service';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepo: Repository<User>,
//     private readonly cacheService: CacheService,
//     private readonly otpService: OtpService,
//     private readonly jwtService: JwtAppService,
//   ) {}

//   async registerByPhone(dto: RegisterByPhoneDto) {
//     const user = await this.userRepo.findOneBy({ phone: dto.phone });

//     if (user) return this.otpService.sendOtpToPhone(user.phone as string);

//     const newUser = this.userRepo.create({
//       phone: dto.phone,
//     });

//     await this.userRepo.save(newUser);

//     return this.otpService.sendOtpToPhone(dto.phone);
//   }

//   async verifyByPhone(dto: VerifyByPhoneDto) {
//     const otp = await this.cacheService.get(`${dto.phone}-otp`);

//     if (!otp) throw new NotFoundException('Otp not found');
//     if (otp != dto.otp) throw new BadRequestException('wrong-otp');

//     const user = (await this.userRepo.findOne({
//       where: { phone: dto.phone },
//     })) as User;

//     const tokens = await this.jwtService.generateToken({
//       sub: user.id,
//       role: user.role,
//     });

//     user.refreshToken = tokens.refreshToken;
//     await this.userRepo.save(user);

//     return tokens;
//   }
// }
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly cacheService: CacheService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtAppService,
  ) {}

  async registerByPhone(dto: RegisterByPhoneDto) {
    const isOtpSentBefore = await this.cacheService.get(`phone:${dto.phone}`);

    if (isOtpSentBefore) throw new HttpException('Too many request', 429);

    let user = await this.userRepo.findOneBy({ phone: dto.phone });

    if (!user) {
      user = this.userRepo.create({
        phone: dto.phone,
        role: ApplicationRoles.USER,
      });
      await this.userRepo.save(user);
    }

    return await this.otpService.sendOtpToPhone(dto.phone);
  }

  async verifyByPhone(dto: VerifyByPhoneDto) {
    const user = await this.userRepo.findOne({ where: { phone: dto.phone } });

    if (!user) throw new NotFoundException('invalid phone-number');

    const otp = await this.cacheService.get(`phone:${dto.phone}`);

    if (!otp) throw new NotFoundException('Otp not found');
    if (!(await Compare(otp, dto.otp)))
      throw new HttpException('wrong-otp', 400);

    await this.cacheService.del(`phone:${dto.phone}`);

    const tokens = await this.jwtService.generateToken({
      sub: user.id,
      role: user.role,
    });

    user.refreshToken = tokens.refreshToken;
    await this.userRepo.save(user);

    return tokens;
  }
}
