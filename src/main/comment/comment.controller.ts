import { Controller, Post, Body, Patch, Param, Get, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/guard/role.enum';
import { Roles } from 'src/auth/guard/roles.decorator';

@ApiTags('comments')

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new comment or reply to an existing comment',
  })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    return this.commentService.create(createCommentDto, req.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment by ID' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req,
  ) {
    return this.commentService.update(id, updateCommentDto, req.sub);
  }

  @Get('count/:postId')
  @ApiOperation({ summary: 'Get comment count for a post' })
  @ApiResponse({
    status: 200,
    description: 'Returns the number of comments for a post.',
  })
  getCommentCountForPost(@Param('postId') postId: string) {
    return this.commentService.getCommentCountForPost(postId);
  }
}
