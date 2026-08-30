import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class paginationDto {
  // An empty or missing query param ('page=' or omitted entirely) must fall
  // back to the default instead of reaching the service as NaN/0.
  @Transform(({ value }) =>
    value === '' || value === undefined ? 1 : Number(value),
  )
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Number of the page to return, starting at 1.',
    default: 1,
  })
  page: number = 1;

  @Transform(({ value }) =>
    value === '' || value === undefined ? 20 : Number(value),
  )
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiProperty({
    description: 'Number of items to return per page, up to 100.',
    default: 20,
  })
  size: number = 20;
}
