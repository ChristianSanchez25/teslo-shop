import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./";


@Entity()
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('text')
    url: string;

    @ManyToOne(
        type => Product, 
        product => product.images,
        { onDelete: 'CASCADE' }
    )
    product: Product;
}