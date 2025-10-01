import {
  BadRequestException,
  Controller,
  Delete,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { apiBodyExample } from './example';
import { UploadResponseDto } from './dto';
import { CloudinaryService } from './cloudinaryService';
import multer from 'multer';
import { Public } from 'src/auth/guard/public.decorator';

const MAX_FILE = 20;
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadService: CloudinaryService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Upload multiple OR single file files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyExample)
  @ApiResponse({ status: 201, type: UploadResponseDto, isArray: true })
  @UseInterceptors(
    FilesInterceptor('files', MAX_FILE, {
      storage: multer.memoryStorage(),
      limits: { files: MAX_FILE }, // TODO: based on the (something) it will be incress and dicress
    }),
  )
  async upload(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<UploadResponseDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No file(s) uploaded');
    }

    if (files.length > MAX_FILE) {
      throw new BadRequestException('You can upload a maximum of 20 files');
    }

    return await this.uploadService.uploadFiles(files);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a file from Cloudinary' })
  @ApiQuery({
    name: 'publicId',
    description: 'Cloudinary public ID of the file',
    required: true,
  })
  // TODO: make sure only owner can delete their own file
  async deleteFile(@Query('publicId') publicId: string) {
    if (!publicId) {
      throw new BadRequestException('publicId query parameter is required');
    }

    const result = await this.uploadService.deleteFile(publicId);

    if (result.result !== 'ok') {
      throw new BadRequestException('Failed to delete file from Cloudinary');
    }

    return { message: 'File deleted successfully', result };
  }
}
