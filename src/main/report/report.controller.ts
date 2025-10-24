import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/guard/public.decorator';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('report_relevant_file'))
  create(
    @UploadedFile() report_relevant_file: Express.Multer.File,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportService.create({
      ...createReportDto,
      report_relevant_file,
    });
  }

  @Roles(Role.Admin)
  @Get('all')
  findAll() {
    return this.reportService.findAll();
  }
}
