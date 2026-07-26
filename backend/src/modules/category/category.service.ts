import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>,
  ) {}
  async create(dto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.repo.create(dto);
    return await this.repo.save(newCategory);
  }

  async findAll(query: PaginateQuery, url: string) {
    return paginate(query, this.repo, {
      defaultSortBy: [['createdAt', 'DESC']],
      sortableColumns: ['createdAt'],
      filterableColumns: {
        title: [FilterOperator.ILIKE],
      },
      origin: url,
    });
  }

  async findOne(id: string) {
    const category = await this.repo.findOne({ where: { id } });

    if (!category) throw new NotFoundException();
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const cateogry = await this.findOne(id);

    Object.assign(cateogry, dto);
    return await this.repo.save(cateogry);
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.repo.softDelete({ id });
  }

  //TODO async exists () {}
}
