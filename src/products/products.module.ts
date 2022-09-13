import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductImage } from './entities';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    CommonModule,
    AuthModule
  ],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
