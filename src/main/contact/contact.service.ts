import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { MailService } from 'src/utils/mail/mail.service';
import { cResponseData } from 'src/common/utils/common-responseData';

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const saveEmailNote = await this.prisma.contact.create({
      data: createContactDto,
    });

    if (saveEmailNote.id) {
      await this.mailService.multiUserSendEmail(
        [saveEmailNote.email],
        'Thnaks for Contact DrinkWithMe',
        `
        <html>
        <div>
        <h1>Thank You for Your Contact</h1>
        Dear Coustomer <br/>
        Thank you for taking the time to contact us. We appreciate your interest and will review your message promptly. If you have any immediate questions or need assistance, please feel free to reach out to us directly. We're here to help!
        <br/>
        Best regards
        Contact Id - ${saveEmailNote.id}
        <br/>
        </div>
        </html>
        `,
      );
      await this.mailService.multiUserSendEmail(
        [process.env.MAIL_USER as string],
        `Contact DrinkWithMe - ${saveEmailNote.name}`,
        `
        <html>
        <div>
        <h1>Thank You for Your Contact</h1>
        Dear DrinkWithMe Team <br/>
        ${saveEmailNote.message}
        <br/>
        Contact Id - ${saveEmailNote.id}
        Contact Email - ${saveEmailNote.email}
        <br/>
        </div>
        </html>
        `,
      );
    }

    return cResponseData({
      message: 'Contact created successfully',
      data: saveEmailNote,
    });
  }

  async findAll() {
    const allEmail = await this.prisma.contact.findMany({
      orderBy: {
        createAt: 'desc',
      },
    });

    return cResponseData({
      message: 'All email',
      data: allEmail,
    });
  }

  async seeUpdate(id: string) {
    const seeUpdateAllready = await this.prisma.contact.findFirst({
      where: {
        id,
      },
    });
    if (seeUpdateAllready && seeUpdateAllready.see) {
      return cResponseData({
        message: ' Already see update ',
        data: null,
      });
    }

    const seeUpdate = await this.prisma.contact.update({
      where: {
        id,
        see: false,
      },
      data: {
        see: true,
      },
    });
    return cResponseData({
      message: 'See update',
      data: seeUpdate,
    });
  }
}
