import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { paginationDto } from 'src/shared/models/dtos/pagination.dto';

export class QueryPermissionsDto extends paginationDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  action: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  subject: string;
}
