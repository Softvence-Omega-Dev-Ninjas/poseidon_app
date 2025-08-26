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
  ValidationPipe,
  UsePipes,
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
  ApiParam,
} from '@nestjs/swagger';

import { Role } from 'src/auth/guard/role.enum';
import { Roles } from 'src/auth/guard/roles.decorator';

import { Request } from 'express';

import { CreateCommentDto } from './dto/create-comment.dto';
import { FindAllCommentsDto } from './dto/find-all-comments.dto';

@ApiTags('posts')
@Roles(Role.Admin, Role.Supporter, Role.User)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
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
    console.log(req.sub);
    return this.postService.findAll(query, req?.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single post by ID' })
  @ApiResponse({ status: 200, description: 'Returns the post.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the post',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  findOne(@Param('id') id: string, @Req() req) {
    return this.postService.findOne(id, req?.sub);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FilesInterceptor('newImages'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the post',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() newImages: Express.Multer.File[],
    @Req() req,
  ) {
    return this.postService.update(id, updatePostDto, newImages, req?.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the post',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.postService.remove(id, req['sub'] as string);
  }

  @Post(':postId/likes')
  @ApiOperation({ summary: 'Create a new like for a post' })
  @ApiResponse({
    status: 201,
    description: 'The like has been successfully created.',
  })
  @ApiResponse({
    status: 409,
    description: 'User has already liked this post.',
  })
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  createLike(@Param('postId') postId: string, @Req() req) {
    return this.postService.createLike(postId, req?.sub);
  }

  @Delete(':postId/likes')
  @ApiOperation({ summary: 'Delete a like for a post' })
  @ApiResponse({
    status: 204,
    description: 'The like has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Like not found.' })
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  deleteLike(@Param('postId') postId: string, @Req() req) {
    return this.postService.deleteLike(postId, req?.sub);
  }

  @Post(':postId/comments')
  @ApiOperation({ summary: 'Create a new comment for a post' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
  })
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    return this.postService.createComment(postId, createCommentDto, req?.sub);
  }

  @Delete('comments/:commentId')
  @ApiOperation({ summary: 'Delete a comment for a post' })
  @ApiResponse({
    status: 204,
    description: 'The comment has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment',
    example: '5857257a-7610-470e-ae2f-29a3ca9c06d5',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  deleteComment(@Param('commentId') commentId: string, @Req() req) {
    return this.postService.deleteComment(commentId, req?.sub);
  }

  @Get(':postId/comments')
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiResponse({ status: 200, description: 'Returns a list of comments.' })
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post',
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
    @Param('postId') postId: string,
    @Query() query: FindAllCommentsDto,
  ) {
    return this.postService.findAllComments(postId, query);
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
    return this.postService.findCommentById(commentId);
  }

  
}
