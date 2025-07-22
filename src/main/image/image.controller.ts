import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FindAllImagesDto } from './dto/find-all-images.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiConsumes } from '@nestjs/swagger';

import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { CreateImageLikeDto } from './dto/create-image-like.dto';
import { CreateImageCommentDto } from './dto/create-image-comment.dto';

@ApiTags('images')
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new image' })
  @ApiResponse({ status: 201, description: 'The image has been successfully created.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Roles(Role.Admin, Role.Supporter, Role.User)
  create(
    @Body() createImageDto: CreateImageDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    return this.imageService.create(createImageDto, req.user.sub, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all images with pagination and sorting' })
  @ApiResponse({ status: 200, description: 'Returns a list of images.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['newest', 'liked', 'viewed'], description: 'Sort order' })
  @ApiQuery({ name: 'visibility', required: false, enum: ['PUBLIC', 'SUPPORTERS'], description: 'Filter by visibility' })
  findAll(@Query() query: FindAllImagesDto, @Req() req) {
    return this.imageService.findAll(query, req.user?.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single image by ID' })
  @ApiResponse({ status: 200, description: 'Returns the image.' })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  findOne(@Param('id') id: string, @Req() req) {
    return this.imageService.findOne(id, req.user?.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an image by ID' })
  @ApiResponse({ status: 200, description: 'The image has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Roles(Role.Admin, Role.Supporter, Role.User)
  update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    return this.imageService.update(id, updateImageDto, req.user.sub, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an image by ID' })
  @ApiResponse({ status: 200, description: 'The image has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  remove(@Param('id') id: string, @Req() req) {
    return this.imageService.remove(id, req.user.sub);
  }

  @Post(':imageId/likes')
  @ApiOperation({ summary: 'Create a new like for an image' })
  @ApiResponse({
    status: 201,
    description: 'The like has been successfully created.',
  })
  @ApiResponse({
    status: 409,
    description: 'User has already liked this image.',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  createLike(@Param('imageId') imageId: string, @Req() req) {
    return this.imageService.createLike(imageId, req.user.sub);
  }

  @Delete(':imageId/likes')
  @ApiOperation({ summary: 'Delete a like for an image' })
  @ApiResponse({
    status: 204,
    description: 'The like has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Image like not found.' })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  deleteLike(@Param('imageId') imageId: string, @Req() req) {
    return this.imageService.deleteLike(imageId, req.user.sub);
  }

  @Post(':imageId/comments')
  @ApiOperation({ summary: 'Create a new comment for an image' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  createComment(@Param('imageId') imageId: string, @Body() createImageCommentDto: CreateImageCommentDto, @Req() req) {
    return this.imageService.createComment(imageId, createImageCommentDto, req.user.sub);
  }

  @Delete(':imageId/comments/:commentId')
  @ApiOperation({ summary: 'Delete a comment for an image' })
  @ApiResponse({
    status: 204,
    description: 'The comment has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Image comment not found.' })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  deleteComment(@Param('imageId') imageId: string, @Param('commentId') commentId: string, @Req() req) {
    return this.imageService.deleteComment(imageId, commentId, req.user.sub);
  }
}
