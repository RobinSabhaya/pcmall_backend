import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

import { IStorageStrategy } from './storage.strategy';

@Injectable()
export class MinIOStrategy implements IStorageStrategy {
  private readonly minIOBucketName;
  private readonly minioClient;

  constructor(private readonly configService: ConfigService) {
    this.minIOBucketName = this.configService.get('minIO.minIOBucket');

    this.minioClient = new Client({
      endPoint: this.configService.get('minIO.minIOEndpoint') as string,
      useSSL: true,
      accessKey: this.configService.get('minIO.minIOAccessKey') as string,
      secretKey: this.configService.get('minIO.minIOSecretKey') as string,
    });
  }

  async generatePresignedPutURL({
    fileName,
  }: {
    fileName: string;
  }): Promise<string> {
    // eslint-disable-next-line no-return-await
    return await this.minioClient.presignedPutObject(
      this.minIOBucketName,
      fileName,
    );
  }
}
