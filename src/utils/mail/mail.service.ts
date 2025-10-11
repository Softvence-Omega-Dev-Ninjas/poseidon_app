import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      // host: process.env.SMTP_HOST, // e.g., 'smtp.hostinger.com'
      // port: 465,
      // secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendEmail(email: string, subject: string, message: string) {
    const mailOptions = {
      from: `"DrinkWithMe" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      html: message,
    };
    return await this.transporter.sendMail(mailOptions);
  }
}
