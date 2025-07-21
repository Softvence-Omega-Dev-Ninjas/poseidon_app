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
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { UseGuards } from '@nestjs/common';

import { Role } from 'src/auth/guard/role.enum';
import { Roles } from 'src/auth/guard/roles.decorator';

@ApiTags('posts')
@Roles(Role.Admin, Role.Supporter, Role.User)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  create(@Body() createPostDto: CreatePostDto, @Req() req) {
    return this.postService.create(createPostDto,req.sub);
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
  findAll(@Query() query: FindAllPostsDto) {
    return this.postService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single post by ID' })
  @ApiResponse({ status: 200, description: 'Returns the post.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  remove(@Param('id') id: string, @Req() req) {
    return this.postService.remove(id, req.user.id);
  }
}
