import { TypeOrmConfig } from '@config/typeorm.config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig })],
  controllers: [],
  providers: [],
})
export class AppModule {}
