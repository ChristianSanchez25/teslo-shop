import { Module } from '@nestjs/common';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { LoggerService } from './loggers/logger.service';
import { IEncrypt } from './ports/IEncrypt';

@Module({
  providers: [LoggerService, BcryptAdapter],
  exports: [LoggerService, BcryptAdapter],
})
export class CommonModule {}
