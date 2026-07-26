import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  AuthorizeByRole,
  PaginationOptions,
  PublicEndPoint,
} from '@shared/decorators';
import { Url } from '@shared/decorators/url.decorator';
import { ApplicationRoles } from '@shared/enums';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post()
  @AuthorizeByRole([ApplicationRoles.OWNER, ApplicationRoles.ADMIN])
  async create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @Get()
  @PublicEndPoint()
  @PaginationOptions({
    filterOptions: [{ field: 'title', example: '$ilike:title' }],
    sortOptions: [{ example: 'createdAt:DESC' }],
  })
  async findAll(@Paginate() query: PaginateQuery, @Url() url: string) {
    return this.service.findAll(query, url);
  }

  @Get(':id')
  @PublicEndPoint()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @AuthorizeByRole([ApplicationRoles.OWNER, ApplicationRoles.ADMIN])
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @AuthorizeByRole([ApplicationRoles.OWNER, ApplicationRoles.ADMIN])
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
