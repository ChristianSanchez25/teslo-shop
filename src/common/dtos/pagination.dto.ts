import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginatonDto {
    @ApiProperty({
        default: 0,
        description: 'The number of items to skip',
    })
    @IsOptional()
    @Type(() => Number)
    @Min(0)
    offset?: number;

    @ApiProperty({
        default: 10,
        description: 'The number of items to return',
    })
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    limit?: number;
}