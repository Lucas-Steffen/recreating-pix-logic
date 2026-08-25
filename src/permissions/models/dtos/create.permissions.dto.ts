import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Action } from "src/auth/models/enums/casl.action";

export class createPermissionsDto {
    @IsEnum(Action)
    @IsNotEmpty()
    @ApiProperty({ enum: Action })
    declare action: Action;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    declare subject: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @ApiPropertyOptional({
        type: [String],
        description: 'IDs of the roles to link this permission to.'
    })
    declare roleIds: string[];
}