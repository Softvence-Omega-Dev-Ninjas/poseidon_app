import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuardGuard } from 'src/auth/auth_guard/auth_guard.guard';

@ApiTags('likes')
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @UseGuards(AuthGuardGuard)
  @ApiOperation({ summary: 'Create a new like for a post' })
  @ApiResponse({ status: 201, description: 'The like has been successfully created.' })
  @ApiResponse({ status: 409, description: 'User has already liked this post.' })
  create(@Body() createLikeDto: CreateLikeDto, @Req() req) {
    return this.likeService.create(createLikeDto, "1ba16d22-d678-4ddb-af6b-cc8e11c1af1c");
  }
}
