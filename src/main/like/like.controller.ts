import { Controller, Post, Body, Get, Param, Req } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('likes')
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new like for a post' })
  @ApiResponse({ status: 201, description: 'The like has been successfully created.' })
  @ApiResponse({ status: 409, description: 'User has already liked this post.' })
  create(@Body() createLikeDto: CreateLikeDto, @Req() req) {
    return this.likeService.create(createLikeDto, req.user.id);
  }

  @Get('count/:postId')
  @ApiOperation({ summary: 'Get like count for a post' })
  @ApiResponse({ status: 200, description: 'Returns the number of likes for a post.' })
  getLikeCountForPost(@Param('postId') postId: string) {
    return this.likeService.getLikeCountForPost(postId);
  }
}
