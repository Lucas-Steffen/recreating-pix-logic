import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class createRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name!: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @ApiPropertyOptional({ type: [String] })
  permissionIds?: string[];
}
