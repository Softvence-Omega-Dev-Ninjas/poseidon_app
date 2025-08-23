import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateMediafileDto } from './dto/create-mediafile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ImageValidationPipe } from 'src/common/utils/image-validation.pipe';

@Controller('mediafile')
export class MediafileController {
  constructor() {}

  @Post()
  @UseInterceptors(FileInterceptor('levelImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMediafileDto })
  create(
    @Body() createMediafileDto: CreateMediafileDto,
    @UploadedFile(new ImageValidationPipe())
    levelImage: Express.Multer.File,
  ) {
    return levelImage;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return 'media';
  }
}
