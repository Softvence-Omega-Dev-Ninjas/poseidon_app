import { Controller, Post, Body } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UseGuards } from '@nestjs/common';
import { AuthGuardGuard } from 'src/auth/auth_guard/auth_guard.guard';

@ApiTags('likes')
@UseGuards(AuthGuardGuard)
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
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.create(
      createLikeDto,
      '1ba16d22-d678-4ddb-af6b-cc8e11c1af1c',
    );
  }
}
