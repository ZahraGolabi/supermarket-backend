import { IsPhoneNumber } from 'class-validator';

export class RegisterByPhoneDto {
  @IsPhoneNumber('IR')
  phone: string;
}
