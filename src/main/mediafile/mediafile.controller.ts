import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  HttpException,
  Get,
} from '@nestjs/common';
import { CreateMediafileDto } from './dto/create-mediafile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ImageValidationPipe } from 'src/common/utils/image-validation.pipe';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { Request } from 'express';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { Public } from 'src/auth/guard/public.decorator';
import { MediafileService } from './mediafile.service';
import { cResponseData } from 'src/common/utils/common-responseData';

@Roles(Role.Supporter)
@Controller('mediafile')
export class MediafileController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly mediafileService: MediafileService,
  ) {}

  @Get()
  findMediabyId(@Param('id') id: string) {
    return this.mediafileService.findByMedia(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMediafileDto })
  create(
    @Body() createMediafileDto: CreateMediafileDto,
    @UploadedFile(new ImageValidationPipe())
    image: Express.Multer.File,
    @Req() req: Request,
  ) {
    const uploadData = this.cloudinaryService.uploadFileFullTbData(image);
    return uploadData;
  }

  @Public()
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    const mediaData = await this.mediafileService.findById(id);
    // // console.log(mediaData);
    if (!(mediaData && mediaData.id) || !(mediaData && mediaData.publicId))
      throw new HttpException(
        cResponseData({
          message: 'Media file not found',
          data: null,
        }),
        404,
      );
    const deletecloudinary: { result: string } =
      await this.cloudinaryService.deleteFile(mediaData?.publicId);
    if (deletecloudinary.result == 'ok') {
      const dltFile = await this.mediafileService.deleteFile(mediaData.id);
      if (dltFile && dltFile.id) {
        return cResponseData({
          message: 'File deleted successfully',
          data: id,
        });
      }
      return cResponseData({
        message: 'Something went wrong',
        data: null,
      });
    }
    return cResponseData({
      message: 'Something went wrong',
      data: null,
    });
  }
}
