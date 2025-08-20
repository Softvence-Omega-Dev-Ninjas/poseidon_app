import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  private imgSize = 2; // Size in MB, can be adjusted as needed
  private fileOff = true;
  constructor(imgSize?: number, fileOff?: boolean) {
    if (imgSize) this.imgSize = imgSize;
    if (fileOff == false) this.fileOff = fileOff;
  }

  transform(file: Express.Multer.File) {
    if (!this.fileOff && !file) {
      return file;
    }

    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const allowedMimeTypes = [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed',
      );
    }

    const maxSizeInBytes = this.imgSize * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      throw new BadRequestException(
        `File size exceeds ${this.imgSize}MB limit`,
      );
    }

    return file;
  }
}
