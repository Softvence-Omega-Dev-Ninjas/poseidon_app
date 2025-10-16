import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      // service: 'gmail',
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendEmail(email: string, subject: string, message: string) {
    const mailOptions = {
      from: `"DrinkWithMe Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      html: message,
    };
    return await this.transporter.sendMail(mailOptions);
  }

  // use this function by admin

  async sendEmailUseToAdmin(email: string, subject: string, message: string) {
    const mailOptions = {
      from: `"DrinkWithMe Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      html: message,
    };
    const resData = await this.transporter.sendMail(mailOptions);

    if (!resData.response.includes('250 2.0.0')) {
      throw new HttpException(
        {
          message: 'Email not sent',
          error: 'BAD_REQUEST',
          data: null,
          success: false,
          next_page: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      message: 'Email sent successfully',
      error: null,
      data: resData.accepted,
      success: true,
    };
  }

  async multiUserSendEmail(emails: string[], subject: string, message: string) {
    const mailOptions = {
      from: `"DrinkWithMe Support" <${process.env.MAIL_USER}>`,
      to: emails,
      subject,
      html: message,
    };
    const resData = await this.transporter.sendMail(mailOptions);

    if (!resData.response.includes('250 2.0.0')) {
      throw new HttpException(
        {
          message: 'Email not sent',
          error: 'BAD_REQUEST',
          data: null,
          success: false,
          next_page: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      message: 'Email sent successfully',
      error: null,
      data: resData.accepted,
      success: true,
    };
  }
}
