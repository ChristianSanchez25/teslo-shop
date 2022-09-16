import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, ManyToOne, OneToMany } from 'typeorm';
import { ProductImage } from './';

@Entity()
export class Product {
    @ApiProperty({
        description: 'The id of the product',
        example: '09a4ee61-e9f7-4064-b5e2-5b92bf672803',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ApiProperty({
        description: 'The title of the product',
        example: 'Product Title',
        uniqueItems: true,
    })
    @Column('text', { unique: true })
    title: string;
    @ApiProperty({
        description: 'The price of the product',
        example: 100,
    })
    @Column('float', { default: 0 })
    price: number;
    @ApiProperty({
        description: 'The description of the product',
        example: 'Product Description',
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;
    @ApiProperty({
        description: 'The slug of the product',
        example: 'product_title',
        uniqueItems: true,
    })
    @Column('text', { unique: true })
    slug: string;
    @ApiProperty({
        description: 'The stock of the product',
        example: 100,
    })
    @Column('int', { default: 0 })
    stock: number;
    @ApiProperty({
        description: 'The sizes of the product',
        example: ['S', 'M', 'L'],
    })
    @Column('text', { array: true })
    sizes: string[];
    @ApiProperty({
        description: 'The gender of the product',
        example: 'Gender'
    })
    @Column('text')
    gender: string;
    @ApiProperty({
        description: 'The tags of the product',
        example: ['Tag1', 'Tag2', 'Tag3'],
    })
    @Column('text', { array: true, default: [] })
    tags: string[];
    @ApiProperty({
        description: 'The images of the product',
        example: ['Image1', 'Image2', 'Image3'],
    })
    @OneToMany(type => ProductImage, 
               productImage => productImage.product,
               { cascade: true , eager: true})
    images: ProductImage[];

    @BeforeInsert()
    generateSlug() {
        if (!this.slug) this.slug = this.title;

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
    @BeforeUpdate()
    generateSlugOnUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
}
