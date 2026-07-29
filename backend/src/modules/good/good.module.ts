import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Good } from './entities/good.entity';
import { GoodController } from './good.controller';
import { GoodService } from './good.service';

@Module({
  imports: [TypeOrmModule.forFeature([Good])],
  controllers: [GoodController],
  providers: [GoodService],
})
export class GoodModule {}
