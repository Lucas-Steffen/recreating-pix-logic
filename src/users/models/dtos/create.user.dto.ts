import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  isStrongPassword,
  IsStrongPassword,
} from 'class-validator';

export class createUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email!: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty()
  password!: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  role: string;
}
