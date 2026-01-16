import { Injectable } from '@nestjs/common';

import { StorageProvider } from '../enums/storage.enum';

import { MinIOStrategy } from './min-io.strategy';

export interface IStorageStrategy {
  generatePresignedPutURL: ({
    fileName,
  }: {
    fileName: string;
  }) => Promise<string>;
}

@Injectable()
export class StorageStrategy {
  constructor(private readonly minio: MinIOStrategy) {}

  getStorageStrategy(provider: StorageProvider): IStorageStrategy {
    // TODO: do better way
    if (provider === StorageProvider.MINIO) {
      return this.minio;
    } else {
      throw new Error('Unsupported storage provider');
    }
  }
}
