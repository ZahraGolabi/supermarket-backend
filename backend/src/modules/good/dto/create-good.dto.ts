import { Brand } from '@core/brand/entities/brand.entity';
import { Category } from '@core/category/entities/category.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exists } from '@shared/validators';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateGoodDto {
  @ApiProperty({
    description: 'عنوان محصول',
    example: 'ماکارونی رنگی ۵۰۰ گرمی',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'عنوان محصول الزامی است' })
  @IsString({ message: 'عنوان باید رشته باشد' })
  @MaxLength(255, { message: 'عنوان نباید بیشتر از ۲۵۵ کاراکتر باشد' })
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiPropertyOptional({
    description: 'اسلاگ (آدرس اینترنتی)',
    example: 'macaroni-rani-500g',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'اسلاگ باید رشته باشد' })
  @MaxLength(255, { message: 'اسلاگ نباید بیشتر از ۲۵۵ کاراکتر باشد' })
  @Matches(/^[a-z0-9-]+$/, {
    message: 'اسلاگ فقط می‌تواند شامل حروف کوچک، اعداد و خط تیره باشد',
  })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  slug?: string;

  @ApiPropertyOptional({
    description: 'توضیحات محصول',
    example: 'ماکارونی رنگی با کیفیت بالا',
  })
  @IsOptional()
  @IsString({ message: 'توضیحات باید رشته باشد' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({
    description: 'وزن یا حجم محصول',
    example: '500g',
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'وزن/حجم باید رشته باشد' })
  @MaxLength(50, { message: 'وزن/حجم نباید بیشتر از ۵۰ کاراکتر باشد' })
  @Transform(({ value }) => value?.trim())
  weightVolume?: string;

  @ApiPropertyOptional({
    description: 'مواد تشکیل‌دهنده محصول',
    example: 'آرد، تخم‌مرغ، نمک',
  })
  @IsOptional()
  @IsString({ message: 'مواد تشکیل‌دهنده باید رشته باشد' })
  @Transform(({ value }) => value?.trim())
  ingredients?: string;

  @ApiPropertyOptional({
    description: 'بارکد محصول',
    example: '1234567890123',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'بارکد باید رشته باشد' })
  @MaxLength(100, { message: 'بارکد نباید بیشتر از ۱۰۰ کاراکتر باشد' })
  @Matches(/^[0-9]+$/, {
    message: 'بارکد فقط می‌تواند شامل اعداد باشد',
  })
  @Transform(({ value }) => value?.trim())
  barcode?: string;

  @ApiProperty({
    description: 'قیمت محصول به تومان',
    example: 45000,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'قیمت الزامی است' })
  @IsNumber({}, { message: 'قیمت باید عدد باشد' })
  @Min(0, { message: 'قیمت نمی‌تواند منفی باشد' })
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({
    description: 'درصد تخفیف',
    example: 15,
    default: 0,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber({}, { message: 'درصد تخفیف باید عدد باشد' })
  @Min(0, { message: 'درصد تخفیف نمی‌تواند منفی باشد' })
  @Max(100, { message: 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد' })
  @Type(() => Number)
  discountPercent?: number = 0;

  @ApiPropertyOptional({
    description: 'وضعیت موجودی',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'وضعیت موجودی باید بولین باشد' })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value === 'true';
    return value;
  })
  isAvailable?: boolean = true;

  @ApiPropertyOptional({
    description: 'محصول ویژه',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'محصول ویژه باید بولین باشد' })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value === 'true';
    return value;
  })
  isFeatured?: boolean = false;

  @ApiPropertyOptional({
    description: 'محصول سالم/رژیمی',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'محصول سالم باید بولین باشد' })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value === 'true';
    return value;
  })
  isHealthy?: boolean = false;

  @ApiPropertyOptional({
    description: 'واحد شمارش محصول',
    example: 'عدد',
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'واحد باید رشته باشد' })
  @MaxLength(50, { message: 'واحد نباید بیشتر از ۵۰ کاراکتر باشد' })
  @Transform(({ value }) => value?.trim())
  unit?: string;

  @ApiPropertyOptional({
    description: 'شناسه برند',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'شناسه برند باید یک UUID معتبر باشد' })
  @Exists(Brand)
  brandId?: string;

  @ApiPropertyOptional({
    description: 'شناسه دسته‌بندی',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID('4', { message: 'شناسه دسته‌بندی باید یک UUID معتبر باشد' })
  @Exists(Category)
  categoryId?: string;
}
