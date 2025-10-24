import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { cResponseData } from 'src/common/utils/common-responseData';
import { MailService } from 'src/utils/mail/mail.service';

@Injectable()
export class ReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mailService: MailService,
  ) {}

  async create(createReportDto: CreateReportDto) {
    console.log('report section', createReportDto);
    if (
      !createReportDto.report_relevant_link &&
      !createReportDto.report_relevant_link2 &&
      !createReportDto.report_relevant_file
    )
      return cResponseData({
        message:
          'Report #Include any supporting evidence or relevant links you may have# is required',
        error: 'Report Username is required',
      });

    // upload file by cloudinaryService
    const { report_relevant_file: file, ...rest } = createReportDto;
    const reportFile = {};
    if (file) {
      const result = await this.cloudinaryService.uploadFileReport(file);
      if (result && result.url)
        reportFile['report_relevant_file'] = result.url as string;
    }

    // report data save with db
    const reportEntreData = await this.prisma.report.create({
      data: {
        ...rest,
        ...reportFile,
      },
    });

    // send email service
    if (reportEntreData.id)
      await this.mailService.multiUserSendEmail(
        [reportEntreData.report_created_email],
        'Report',
        `
        <html>
        <div>
        <h1>Thank You for Your Report</h1>
        Dear Coustomer <br/>
        Thank you for taking the time to submit a report. We appreciate your feedback and will review the issue promptly. If you have any additional information or details that would help us better understand the situation, please don't hesitate to let us know. We're committed to addressing this matter as soon as possible.
        <br/>
        Best regards
        <br/>
        <br/>
        Report User - ${reportEntreData.report_username} <br/>
        Report Type - ${reportEntreData.report_type} <br/>
        Report Description - ${reportEntreData.report_description} <br/>
        </div>
        </html>
        `,
      );
    return cResponseData({
      message: 'Report Created',
      data: reportEntreData,
    });
  }

  async findAll() {
    const allReport = await this.prisma.report.findMany({
      include: {
        reported_user: {
          select: {
            username: true,
            email: true,
            id: true,
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return cResponseData({
      message: 'All Report',
      data: allReport,
    });
  }
}
