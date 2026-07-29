import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthorizeByRole } from '@shared/decorators';
import { ApplicationRoles } from '@shared/enums';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import { GoodService } from './good.service';

@Controller('good')
export class GoodController {
  constructor(private readonly goodService: GoodService) {}

  @Post()
  @AuthorizeByRole([ApplicationRoles.ADMIN, ApplicationRoles.OWNER])
  async create(@Body() createGoodDto: CreateGoodDto) {
    return await this.goodService.create(createGoodDto);
  }

  @Get()
  findAll() {
    return this.goodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goodService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoodDto: UpdateGoodDto) {
    return this.goodService.update(+id, updateGoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goodService.remove(+id);
  }
}
