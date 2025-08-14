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
import { FindAllImagesDto, ImageSortBy } from './dto/find-all-images.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { UseGuards } from '@nestjs/common';

import { Role } from 'src/auth/guard/role.enum';
import { Roles } from 'src/auth/guard/roles.decorator';
import { CreateImageCommentDto } from './dto/create-image-comment.dto';
import { FindAllImageCommentsDto } from './dto/find-all-image-comments.dto';
import { Roles as Visibility } from '../../../generated/prisma';

@ApiTags('images')
@Roles(Role.Admin, Role.Supporter, Role.User)
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create a new image' })
  @ApiResponse({
    status: 201,
    description: 'The image has been successfully created.',
  })
  @Roles(Role.Supporter)
  create(
    @Body() createImageDto: CreateImageDto,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imageService.create(createImageDto, req.sub, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all images with pagination and sorting' })
  @ApiResponse({ status: 200, description: 'Returns a list of images.' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: [ImageSortBy.VIEWED, ImageSortBy.LIKED, ImageSortBy.NEWEST],
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'visibility',
    required: false,
    enum: [Visibility.admin, Visibility.user, Visibility.supporter],
    description: 'Filter by visibility',
  })
  findAll(@Query() query: FindAllImagesDto, @Req() req) {
    return this.imageService.findAll(query, req.user?.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single image by ID' })
  @ApiResponse({ status: 200, description: 'Returns the image.' })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the image',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  findOne(@Param('id') id: string, @Req() req) {
    return this.imageService.findOne(id, req.user?.sub);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('newImage'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update an image by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the image',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  @Roles(Role.Supporter)
  update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
    @UploadedFile() newImage: Express.Multer.File,
    @Req() req,
  ) {
    return this.imageService.update(
      id,
      updateImageDto,
      newImage,
      req.user?.sub,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an image by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the image',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  @Roles(Role.Supporter)
  remove(@Param('id') id: string, @Req() req) {
    return this.imageService.remove(id, req.user?.sub);
  }

  @Post(':imageId/likes')
  @ApiOperation({ summary: 'Create a new like for an image' })
  @ApiParam({
    name: 'imageId',
    description: 'The ID of the image',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  createLike(@Param('imageId') imageId: string, @Req() req) {
    return this.imageService.createLike(imageId, req.sub);
  }

  @Delete(':imageId/likes')
  @ApiOperation({ summary: 'Delete a like for an image' })
  @ApiParam({
    name: 'imageId',
    description: 'The ID of the image',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  deleteLike(@Param('imageId') imageId: string, @Req() req) {
    return this.imageService.deleteLike(imageId, req.user?.sub);
  }

  @Post(':imageId/comments')
  @ApiOperation({ summary: 'Create a new comment for an image' })
  @ApiBody({
    type: CreateImageCommentDto,
    description: 'Comment content and optional parentId',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  createComment(
    @Param('imageId') imageId: string,
    @Body() createImageCommentDto: CreateImageCommentDto,
    @Req() req,
  ) {
    return this.imageService.createComment(
      imageId,
      createImageCommentDto,
      req.user?.sub,
    );
  }

  @Delete(':imageId/comments/:commentId')
  @ApiOperation({ summary: 'Delete a comment for an image' })
  @ApiParam({
    name: 'imageId',
    description: 'The ID of the image',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  deleteComment(
    @Param('imageId') imageId: string,
    @Param('commentId') commentId: string,
    @Req() req,
  ) {
    return this.imageService.deleteComment(imageId, commentId, req.user?.sub);
  }

  @Get(':imageId/comments')
  @ApiOperation({ summary: 'Get all comments for an image' })
  @ApiResponse({ status: 200, description: 'Returns a list of comments.' })
  @ApiParam({
    name: 'imageId',
    description: 'The ID of the image',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  findAllComments(
    @Param('imageId') imageId: string,
    @Query() query: FindAllImageCommentsDto,
  ) {
    return this.imageService.findAllComments(imageId, query);
  }

  @Get('comments/:commentId')
  @ApiOperation({ summary: 'Get a single comment by ID' })
  @ApiResponse({ status: 200, description: 'Returns the comment.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  findCommentById(@Param('commentId') commentId: string) {
    return this.imageService.findCommentById(commentId);
  }

  @Patch(':id/view')
  @ApiOperation({ summary: 'Increment image view count' })
  @ApiResponse({ status: 200, description: 'Image view count incremented.' })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the image',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  incrementViewCount(@Param('id') id: string) {
    return this.imageService.incrementViewCount(id);
  }

  @Get('visibility/:visibility')
  @ApiOperation({ summary: 'Get images by visibility' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of images filtered by visibility.',
  })
  @ApiParam({
    name: 'visibility',
    enum: ['PUBLIC', 'SUPPORTERS'],
    description: 'Visibility status',
  })
  getImagesByVisibility(
    @Param('visibility') visibility: Visibility,
    @Req() req,
  ) {
    return this.imageService.getImagesByVisibility(visibility, req.user?.sub);
  }
}
