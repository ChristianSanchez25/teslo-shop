import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        description: 'The title of the product',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'The price of the product'
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    sizes?: string[];

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];

    @ApiProperty()
    @IsIn(['men', 'woman', 'unisex', 'kid'])
    gender?: string;
}
