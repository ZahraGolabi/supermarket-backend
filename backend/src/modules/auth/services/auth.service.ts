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

import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationRoles } from '@shared/enums';
import { CacheService } from '@shared/providers';
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

    if (otp !== dto.otp) throw new HttpException('wrong-otp', 400);

    await this.cacheService.del(`phone:${dto.phone}`);

    const tokens = await this.jwtService.generateToken({
      sub: user.id,
      role: user.role,
    });

    user.refreshToken = tokens.refreshToken;
    await this.userRepo.save(user);

    return tokens;
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyRefreshToken(token);

      const user = await this.userRepo.findOne({
        where: { id: payload.sub, refreshToken: token },
        select: {
          role: true,
          refreshToken: true,
        },
      });

      if (!user) throw new ForbiddenException('refresh-token is not yours');

      const accessToken: string = await this.jwtService.generateAccessToken({
        sub: payload.sub,
        role: payload.role,
      });

      return {
        accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
