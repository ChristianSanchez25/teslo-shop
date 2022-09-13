import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { LoggerService } from '../common/loggers/logger.service';
import { PaginatonDto } from '../common/dtos/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository : Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository : Repository<ProductImage>,
    private readonly logger: LoggerService,
    private readonly dateSource: DataSource,
  ){}
  
  
  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image })),
      });
      await this.productRepository.save(product);
      this.logger.log(`Product ${product.id} created`, 'ProductsService');
      return {...product, images};
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(paginationDto: PaginatonDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });
    this.logger.log(`${products.length} products found`, 'ProductsService');
    return products.map(product => ({
        ...product,
        images: product.images.map(image => image.url),
      }));
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    })
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const queryRunner = this.dateSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product : {id} });
        product.images = images.map(image => this.productImageRepository.create({ url: image }));
      } else {
        product.images = await this.productImageRepository.find({ where: { product: { id } } });
      }
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      this.logger.log(`Product ${product.id} updated`, 'ProductsService');
      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    this.productRepository.remove(product);
  }

  private handleError(error: any) {
    this.logger.error(error.message, 'ProductsService');
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Error product');
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleError(error);
    }
  }
}
