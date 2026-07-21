import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheService } from '@shared/providers';
import { AuthController } from './controllers/auth.controller';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { JwtAppService } from './services/jwt.service';
import { OtpService } from './services/otp.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtAppService, CacheService, OtpService],
  exports: [JwtAppService, CacheService],
})
export class AuthModule {}
