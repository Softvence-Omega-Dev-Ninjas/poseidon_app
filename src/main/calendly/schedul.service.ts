import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CalendlyWebhookPayload } from './types/webhookPayload';

interface trck {
  utm_campaign?: string | null | undefined;
  utm_source?: string | null | undefined; // membership / service / supporter card
  utm_medium?: string | null | undefined; // service table Id - uuid
  utm_content?: string | null | undefined; // duration
  utm_term?: string | null | undefined; //userid
  salesforce_uuid?: string | null | undefined; //bergirlid
}

@Injectable()
export class SchedulService {
  constructor(private readonly prisma: PrismaService) {}

  async setSchedulSystem(data: CalendlyWebhookPayload) {
    const trck: trck = data.payload.tracking;
    if (
      !trck.utm_term ||
      !trck.utm_medium ||
      !trck.salesforce_uuid ||
      !trck.utm_source
    )
      return;

    // membership
    if (data.payload.tracking?.utm_medium == 'membership') {
      const newdata = await this.prisma.scheduledEvent.create({
        data: {
          utm_term_userId: trck.utm_term,
          salesforce_uuid_bergirlId: trck.salesforce_uuid,
          schedulType_utm_source: 'membership', //trck.utm_source,
          membershipTbId_utm_medium: trck.utm_medium,
          start_time: data.payload.scheduled_event.start_time,
          end_time: data.payload.scheduled_event.end_time,
          join_url: data.payload.scheduled_event.location.join_url,
        },
      });
      if (newdata?.membershipTbId_utm_medium)
        await this.membershipCallDataUpdate(newdata.membershipTbId_utm_medium);
    }
  }

  private async membershipCallDataUpdate(id: string) {
    const vca = await this.prisma.permissionVideoCallAccess.findFirst({
      where: {
        id,
        paymentDetails: {
          endDate: {
            gt: new Date(),
          },
        },
      },
    });
    if (!vca) return;
    if (!vca.unlimitedVideoCalls && vca.totalVideoCalls > 0) {
      await this.prisma.permissionVideoCallAccess.update({
        where: { id },
        data: { totalVideoCalls: vca.totalVideoCalls - 1 },
      });
    }
  }
}
