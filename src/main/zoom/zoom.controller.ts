import { Controller, Post, Param, Body, Patch, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ZoomService } from './zoom.service';
import { CreateMeetingDto, CreateZoomUserDto } from './dot/create-meeting.dto';

@ApiTags('Zoom')
@Controller('providers/:providerId/zoom')
export class ZoomController {
  constructor(private readonly zoomService: ZoomService) {}




  @Post('account')
  @ApiOperation({ summary: 'Create Zoom account for provider' })
  @ApiBody({ type: CreateZoomUserDto })
  @ApiResponse({
    status: 201,
    description: 'Zoom account created and stored',
    schema: {
      example: {
        id: 'ckxyz123',
        providerId: 'provider123',
        zoomUserId: 'pCkSjASDAS123asd',
        email: 'provider@example.com',
        apiBase: 'https://api.zoom.us/v2',
        createdAt: '2025-09-04T08:00:00.000Z',
      },
    },
  })
  async createZoomAccount(
    @Param('providerId') providerId: string,
    @Body() dto: CreateZoomUserDto,
  ) {
    const account = await this.zoomService.createProviderZoomAccount(providerId, dto);
    return {
      statusCode: 201,
      success: true,
      message: 'Zoom account created and stored',
      data: account,
    };
  }

  @Post('meetings')
  @ApiOperation({ summary: 'Create a Zoom meeting for provider' })
  @ApiBody({ type: CreateMeetingDto })
  @ApiResponse({
    status: 201,
    description: 'Meeting created',
    schema: {
      example: {
        id: 123456789,
        join_url: 'https://zoom.us/j/123456789',
        start_url: 'https://zoom.us/s/123456789?zak=abcdef',
      },
    },
  })
  async createMeeting(
    @Param('providerId') providerId: string,
    @Body() dto: CreateMeetingDto,
  ) {

           
    const meeting = await this.zoomService.createMeetingForBasicUser(providerId, dto);
    return {
      statusCode: 201,
      success: true,
      message: 'Zoom meeting created',
      data: meeting,
    };
  }


  
}
