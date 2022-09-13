import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';
import { ConfigService } from '@nestjs/config';



@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}


  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }  


  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1024 * 1024 * 5 },
    storage: diskStorage({ 
      destination: './static/products',
      filename: fileNamer 
    })
  }))
  uploadProductImage(
    @UploadedFile() file : Express.Multer.File,
  ) {

    if (!file) throw new BadRequestException('Make sure you have selected a file');

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return {
      message: 'File uploaded successfully',
      secureUrl
    };
  }
}
