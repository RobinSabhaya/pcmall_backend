import { Module } from '@nestjs/common';

import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MinIOStrategy } from './strategies/min-io.strategy';
import { StorageStrategy } from './strategies/storage.strategy';

@Module({
  controllers: [FileController],
  providers: [FileService, StorageStrategy, MinIOStrategy],
})
export class FileModule {}
