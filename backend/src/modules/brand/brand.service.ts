import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly repo: Repository<Brand>,
  ) {}
  async create(dto: CreateBrandDto) {
    const newBrand = this.repo.create(dto);
    return this.repo.save(newBrand);
  }

  async findAll() {
    return `This action returns all brand`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} brand`;
  }

  async update(id: string, dto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  async remove(id: string) {
    return `This action removes a #${id} brand`;
  }
}
