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
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
import { Visibility } from '../../../generated/prisma';

@ApiTags('images')
@Roles(Role.Admin, Role.Supporter, Role.User)
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Create a new image' })
  @ApiResponse({
    status: 201,
    description: 'The image has been successfully created.',
  })
  @ApiBody({
    description: 'Form data for creating an image',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'My Awesome Image' },
        visibility: {
          type: 'string',
          enum: ['PUBLIC', 'SUPPORTERS'],
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['title', 'visibility', 'images'],
    },
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  create(
    @Body() createImageDto: CreateImageDto,
    @Req() req,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    return this.imageService.create(createImageDto, req.sub, files);
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
    enum: [Visibility.PUBLIC, Visibility.SUPPORTERS],
    description: 'Filter by visibility',
  })
  findAll(@Query() query: FindAllImagesDto, @Req() req) {
    return this.imageService.findAll(query, req.user?.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single image by ID' })
  @ApiResponse({ status: 200, description: 'Returns the image.' })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  @ApiParam({ name: 'id', description: 'The ID of the image', example: '5857257a-7610-470e-ae2f-29a3ca9c06d5' })
  findOne(@Param('id') id: string, @Req() req) {
    return this.imageService.findOne(id, req.user?.sub);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('newImages'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update an image by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the image', example: '5857257a-7610-470e-ae2f-29a3ca9c06d5' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Updated Image Title' },
        visibility: {
          type: 'string',
          enum: ['PUBLIC', 'SUPPORTERS'],
        },
        images: {
          type: 'array',
          items: { type: 'string', example: 'media id' },
          description: 'List of media IDs to remove.',
        },
        newImages: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'New image files to upload.',
        },
      },
    },
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
    @UploadedFiles() newImages: Express.Multer.File[],
    @Req() req,
  ) {
    return this.imageService.update(id, updateImageDto, newImages, req.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an image by ID' })
  @ApiResponse({
    status: 200,
    description: 'The image has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  @ApiParam({ name: 'id', description: 'The ID of the image', example: '5857257a-7610-470e-ae2f-29a3ca9c06d5' })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  remove(@Param('id') id: string, @Req() req) {
    return this.imageService.remove(id, req.sub);
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
  @ApiParam({ name: 'imageId', description: 'The ID of the image', example: '5857257a-7610-470e-ae2f-29a3ca9c06d5' })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  createLike(@Param('imageId') imageId: string, @Req() req) {
    return this.imageService.createLike(imageId, req.sub);
  }

  @Delete(':imageId/likes')
  @ApiOperation({ summary: 'Delete a like for an image' })
  @ApiResponse({
    status: 204,
    description: 'The like has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Like not found.' })
  @ApiParam({ name: 'imageId', description: 'The ID of the image', example: '5857257a-7610-470e-ae2f-29a3ca9c06d5' })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  deleteLike(@Param('imageId') imageId: string, @Req() req) {
    return this.imageService.deleteLike(imageId, req.sub);
  }

  @Post(':imageId/comments')
  @ApiOperation({ summary: 'Create a new comment for an image' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
  })
  @ApiParam({ name: 'imageId', description: 'The ID of the image', example: '5857257a-7610-470e-ae2f-29a3ca9c06d5' })
  @ApiBody({
    type: CreateImageCommentDto,
    description: 'Comment content and optional parentId',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  createComment(@Param('imageId') imageId: string, @Body() createImageCommentDto: CreateImageCommentDto, @Req() req) {
    return this.imageService.createComment(imageId, createImageCommentDto, req.sub);
  }

  @Delete(':imageId/comments/:commentId')
  @ApiOperation({ summary: 'Delete a comment for an image' })
  @ApiResponse({
    status: 204,
    description: 'The comment has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @ApiParam({ name: 'imageId', description: 'The ID of the image', example: '5857257a-7610-470e-ae2f-29a3ca9c06d5' })
  @ApiParam({ name: 'commentId', description: 'The ID of the comment', example: '5857257a-7610-470e-ae2f-29a3ca9c06d5' })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  deleteComment(@Param('imageId') imageId: string, @Param('commentId') commentId: string, @Req() req) {
    return this.imageService.deleteComment(imageId, commentId, req.sub);
  }

  @Get(':imageId/comments')
  @ApiOperation({ summary: 'Get all comments for an image' })
  @ApiResponse({ status: 200, description: 'Returns a list of comments.' })
  @ApiParam({ name: 'imageId', description: 'The ID of the image', example: '5857257a-7610-470e-ae2f-29a3ca9c06d5' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  findAllComments(@Param('imageId') imageId: string, @Query() query: FindAllImageCommentsDto) {
    return this.imageService.findAllComments(imageId, query);
  }

  @Get('comments/:commentId')
  @ApiOperation({ summary: 'Get a single comment by ID' })
  @ApiResponse({ status: 200, description: 'Returns the comment.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @ApiParam({ name: 'commentId', description: 'The ID of the comment', example: '5857257a-7610-470e-ae2f-29a3ca9c06d5' })
  findCommentById(@Param('commentId') commentId: string) {
    return this.imageService.findCommentById(commentId);
  }

  @Patch(':id/view')
  @ApiOperation({ summary: 'Increment image view count' })
  @ApiResponse({ status: 200, description: 'Image view count incremented.' })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  @ApiParam({ name: 'id', description: 'The ID of the image', example: '5857257a-7610-470e-ae2f-29a3ca9c06d5' })
  incrementViewCount(@Param('id') id: string) {
    return this.imageService.incrementViewCount(id);
  }

  @Get('visibility/:visibility')
  @ApiOperation({ summary: 'Get images by visibility' })
  @ApiResponse({ status: 200, description: 'Returns a list of images filtered by visibility.' })
  @ApiParam({ name: 'visibility', enum: ['PUBLIC', 'SUPPORTERS'], description: 'Visibility status' })
  getImagesByVisibility(@Param('visibility') visibility: Visibility, @Req() req) {
    return this.imageService.getImagesByVisibility(visibility, req.user?.sub);
  }
}
