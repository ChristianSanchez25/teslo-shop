import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./";


@Entity()
export class ProductImage {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;
    
    @ApiProperty()
    @Column('text')
    url: string;

    @ApiProperty()
    @ManyToOne(
        type => Product, 
        product => product.images,
        { onDelete: 'CASCADE' }
    )
    product: Product;
}