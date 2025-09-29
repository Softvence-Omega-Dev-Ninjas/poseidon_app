import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',

      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }


  async sendEmail(
    email: string,
    subject: string,
    message: string,
  ): Promise<nodemailer.SentMessageInfo> {
    const mailOptions = {
      from: `"No Reply" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      html: message,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
