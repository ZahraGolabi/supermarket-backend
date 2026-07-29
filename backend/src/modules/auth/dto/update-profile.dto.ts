import { ApiProperty } from '@nestjs/swagger';
import { GenderEnum } from '@shared/enums';
import { IsDateOnly } from '@shared/validators';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @Length(3, 100)
  @IsOptional()
  firstName?: string;

  @IsString()
  @Length(3, 100)
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: '2025-11-02', required: false })
  @IsDateOnly()
  @IsOptional()
  birthDate?: Date;

  @ApiProperty({ example: GenderEnum.MAN, enum: GenderEnum, required: false })
  @IsEnum(GenderEnum)
  @IsOptional()
  gender?: GenderEnum;
}
