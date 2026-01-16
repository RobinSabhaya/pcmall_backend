import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GenerateUrlDto } from './dto/file.dto';
import { StorageProvider } from './enums/storage.enum';
import { IGenerateUrl } from './file.interface';
import { StorageStrategy } from './strategies/storage.strategy';

@Injectable()
export class FileService {
  private readonly strategy;
  constructor(
    private readonly storageStrategy: StorageStrategy,
    private readonly configService: ConfigService,
  ) {
    this.strategy = this.storageStrategy.getStorageStrategy(
      this.configService.get('minIO.fileStorageProvider') as StorageProvider,
    );
  }

  async generateUrl(generateUrlDto: GenerateUrlDto): Promise<IGenerateUrl> {
    const url = await this.strategy.generatePresignedPutURL(generateUrlDto);

    return {
      url,
      message: 'File upload URL generated successfully',
    };
  }
}
