import { Controller, Post, Body, Req, Delete, Param } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';


@ApiTags('likes')
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new like for a post' })
  @ApiResponse({
    status: 201,
    description: 'The like has been successfully created.',
  })
  @ApiResponse({
    status: 409,
    description: 'User has already liked this post.',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  create(@Body() createLikeDto: CreateLikeDto, @Req() req) {
    return this.likeService.create(
      createLikeDto,
      req.sub,
    );
  }

  @Delete(':postId')
  @ApiOperation({ summary: 'Delete a like for a post' })
  @ApiResponse({
    status: 204,
    description: 'The like has been successfully deleted.',
  })
  @Roles(Role.Admin, Role.Supporter, Role.User)
  delete(@Param('postId') postId: string, @Req() req) {
    return this.likeService.delete(postId, req.sub);
  }
}
