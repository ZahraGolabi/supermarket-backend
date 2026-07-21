import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class VerifyByPhoneDto {
  @IsPhoneNumber('IR')
  phone: string;

  @IsString()
  @Length(5, 5)
  otp: string;
}
