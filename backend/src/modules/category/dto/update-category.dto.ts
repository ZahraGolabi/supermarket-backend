import { DeepPartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends DeepPartialType(CreateCategoryDto) {}
