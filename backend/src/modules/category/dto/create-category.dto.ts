import { NotExists } from '@shared/validators';
import { IsString } from 'class-validator';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto {
  @IsString()
  @NotExists(Category)
  title: string;

  @IsString()
  description: string;
}
