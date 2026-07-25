import { TypeOrmConfig } from '@config/typeorm.config';
import { AuthModule } from '@core/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AppCacheModule,
  AuthorizationModule,
  RedisModule,
} from '@shared/modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    EventEmitterModule.forRoot({
      global: true,
      ignoreErrors: false,
      verboseMemoryLeak: true,
      newListener: true,
      removeListener: true,
    }),
    ScheduleModule.forRoot({}),
    RedisModule.forRootAsync(),
    AppCacheModule,
    AuthorizationModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
