import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, Max } from "class-validator";

export class paginationDto {
    @Type(() => Number) // Query params always arrive as strings, so cast before @IsNumber() runs.
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Number of the page to return, starting at 1.'
    })
    page: number = 1;

    @Type(() => Number) // Query params always arrive as strings, so cast before @IsNumber() runs.
    @IsNumber()
    @IsNotEmpty()
    @Max(100)
    @ApiProperty({
        description: 'Number of items to return per page, up to 100.'
    })
    size: number = 20;
}
