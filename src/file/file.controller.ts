import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { Public } from '../auth/auth.decorator';

import { GenerateUrlDto } from './dto/file.dto';
import { IGenerateUrlResponse } from './file.interface';
import { FileService } from './file.service';

@Controller({
  version: '1',
  path: 'file',
})
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @HttpCode(HttpStatus.OK)
  @Post('generate-url')
  @Public()
  async generateURL(
    @Body() generateUrlDto: GenerateUrlDto,
  ): Promise<IGenerateUrlResponse> {
    const { url, message } = await this.fileService.generateUrl(generateUrlDto);

    return {
      success: true,
      message,
      data: {
        url,
      },
    };
  }
}
