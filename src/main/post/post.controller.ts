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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { UseGuards } from '@nestjs/common';

import { Role } from 'src/auth/guard/role.enum';
import { Roles } from 'src/auth/guard/roles.decorator';
import { ApiFile } from 'src/common/dto/structured-array.dto';

@ApiTags('posts')
@Roles(Role.Admin, Role.Supporter, Role.User)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @ApiBody({
    description: 'Form data for creating a post',
    schema: {
      type: 'object',
      properties: {
        drafted: { type: 'boolean', example: true },
        description: {
          type: 'string',
          example: 'This is a great post!',
        },
        whoCanSee: {
          type: 'string',
          enum: ['PUBLIC', 'PRIVATE', 'FRIENDS'], // Match your WhoCanSee enum
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['description', 'drafted', 'whoCanSee'],
    },
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    return this.postService.create(createPostDto, req.sub, files);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination and sorting' })
  @ApiResponse({ status: 200, description: 'Returns a list of posts.' })
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
    enum: ['viewed', 'liked', 'newest'],
    description: 'Sort order',
  })
  findAll(@Query() query: FindAllPostsDto, @Req() req) {
    return this.postService.findAll(query, req.user?.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single post by ID' })
  @ApiResponse({ status: 200, description: 'Returns the post.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  findOne(@Param('id') id: string, @Req() req) {
    return this.postService.findOne(id, req.user?.sub);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('newImages'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        drafted: { type: 'boolean', example: true },
        description: { type: 'string', example: 'Updated post text' },
        whoCanSee: {
          type: 'string',
          enum: ['PUBLIC', 'PRIVATE', 'FRIENDS'],
        },
        images: {
          type: 'string',
          description: 'JSON string of image actions',
          example: '[{"value":"https://img.jpg","action":"add"}]',
        },
        newImages: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Optional new image files to upload',
        },
      },
    },
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() newImages: Express.Multer.File[],
    @Req() req,
  ) {
     console.log(id,updatePostDto,newImages,req.sub)
    // return this.postService.update(id, updatePostDto, newImages, req.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  remove(@Param('id') id: string, @Req() req) {
    return this.postService.remove(id, req.sub);
  }
}
