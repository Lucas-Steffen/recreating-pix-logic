import { ApiProperty } from "@nestjs/swagger";

export class PaginatedResponseDto<T> {
    @ApiProperty({ isArray: true })
    data: T[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    size: number;

    @ApiProperty()
    totalPages: number;

    constructor(data: T[], total: number, page: number, size: number) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.size = size;
        this.totalPages = Math.ceil(total / size);
    }
}
