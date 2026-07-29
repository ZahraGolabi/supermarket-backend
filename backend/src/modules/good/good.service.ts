import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import { Good } from './entities/good.entity';

@Injectable()
export class GoodService {
  constructor(
    @InjectRepository(Good)
    private readonly repo: Repository<Good>,
  ) {}
  async create(dto: CreateGoodDto) {
    const newGood = this.repo.create(dto);
    return await this.repo.save(newGood);
  }

  async findAll() {
    return `not implemented`;
  }

  async findOne(id: number) {
    return `not implemented`;
  }

  async update(id: number, updateGoodDto: UpdateGoodDto) {
    return `not implemented`;
  }

  async remove(id: number) {
    return `not implemented`;
  }
}
