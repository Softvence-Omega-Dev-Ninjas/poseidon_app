import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

import { CreateMeetingDto, CreateZoomUserDto } from './dot/create-meeting.dto';


@Injectable()
export class ZoomService {
  // constructor(private prisma: PrismaService) {}

  // 🔑 Generate OAuth token for master account
  private async getMasterToken(): Promise<string> {
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;
    const accountId = process.env.ZOOM_ACCOUNT_ID;

    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
      const response = await axios.post(
        'https://zoom.us/oauth/token',
        null,
        {
          params: { grant_type: 'account_credentials', account_id: accountId },
          headers: {
            Authorization: `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      return response.data.access_token;
    } catch (error: any) {
      throw new HttpException(error.response?.data || error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 👉 Step 1: Create Zoom account for provider
  async createProviderZoomAccount(providerId: string, dto: CreateZoomUserDto) {
    const token = await this.getMasterToken();
    const apiBase = process.env.ZOOM_API_BASE || 'https://api.zoom.us/v2';
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;

    try {
      const response = await axios.post(
        `${apiBase}/users`,
        {
          action: 'create',
          user_info: {
            email: dto.email,
            type: 1,
            first_name: dto.firstName || '',
            last_name: dto.lastName || '',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const zoomUser = response.data;

      // Store in DB
      // const zoomAccount = await this.prisma.zoomAccount.create({
      //   data: {
      //     providerId,
      //     zoomUserId: zoomUser.id,
      //     email: zoomUser.email,
      //     clientId:clientId ?? '',
      //     clientSecret:clientSecret ?? '', 
      //     apiBase,
      //   },
      // });

      // return zoomAccount;
    } catch (error: any) {
      throw new HttpException(error.response?.data || error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 👉 Step 2: Create meeting for provider
async createMeetingForBasicUser(providerId: string, dto: CreateMeetingDto) {
  const token = await this.getMasterToken(); // token from master account
  const apiBase = process.env.ZOOM_API_BASE || 'https://api.zoom.us/v2';

  // const zoomAccount = await this.prisma.zoomAccount.findUnique({
  //   where: { providerId },
  // });

  // if (!zoomAccount) {
  //   throw new HttpException('Zoom account not found for provider', HttpStatus.NOT_FOUND);
  // }

  // try {
  //   // Create meeting for a Basic user
  //   const meetingResponse = await axios.post(
  //     `${apiBase}/users/${zoomAccount.zoomUserId}/meetings`,
  //     {
  //       topic: dto.topic,
  //       type: 2, // scheduled meeting
  //       start_time: dto.start_time,
  //       duration: Math.min(dto.duration, 40), // Basic user max group meeting 40 minutes
  //       agenda: dto.agenda || '',
  //       settings: {
  //         host_video: true,
  //         participant_video: true,
  //         join_before_host: false,
  //         waiting_room: true, // optional safety
  //         approval_type: 2,   // anyone can join, no registration required
  //         registration_type: 1,
  //         registrants_email_notification: false,
  //       },
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     },
  //   );

  //   const meeting = meetingResponse.data;

  //   // Return meeting info; skip registrant step for Basic users
  //   return {
  //     meeting,
  //     message: 'Meeting created successfully for Basic user. Note: max 40 min duration for group meetings.',
  //   };
  // } catch (error: any) {
  //   throw new HttpException(error.response?.data || error.message, HttpStatus.BAD_REQUEST);
  // }
}



// async downgradeProviderToBasic(providerId: string) {
//     const token = await this.getMasterToken();
//     const apiBase = process.env.ZOOM_API_BASE || 'https://api.zoom.us/v2';

//     // Get provider's Zoom account from DB
//     const zoomAccount = await this.prisma.zoomAccount.findUnique({
//       where: { providerId },
//     });

//     if (!zoomAccount) {
//       throw new HttpException('Zoom account not found for provider', HttpStatus.NOT_FOUND);
//     }

//     try {
//       // Patch Zoom user to type 1 (Basic)
//       await axios.patch(
//         `${apiBase}/users/${zoomAccount.zoomUserId}`,
//         { type: 1 },
//         { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
//       );

//       return { providerId, zoomUserId: zoomAccount.zoomUserId, status: 'Downgraded to Basic' };
//     } catch (error: any) {
//       throw new HttpException(error.response?.data || error.message, HttpStatus.BAD_REQUEST);
//     }
//   }

    

}
