import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { paginationDto } from "src/shared/models/dtos/pagination.dto";

export class QueryRolesDto extends paginationDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: "UUID of the role to filter results by."
    })
    id: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: "Name of the role to filter results by."
    })
    role: string;
}