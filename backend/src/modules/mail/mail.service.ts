import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  async sendDemoRequestEmail(tutorEmail: string, studentName: string) {
    try {
      if (!process.env.SMTP_USER) {
        this.logger.warn(`Email simulated to ${tutorEmail}: New demo requested by ${studentName}`);
        return;
      }
      
      await this.transporter.sendMail({
        from: `"Aura Edu" <${process.env.SMTP_FROM || 'noreply@auraedu.com'}>`,
        to: tutorEmail,
        subject: 'New Demo Request Pending! 🌟',
        html: `
          <h3>Hello Tutor,</h3>
          <p>You have a new demo request from <strong>${studentName}</strong>.</p>
          <p>Please log in to your dashboard to review and accept the request.</p>
          <p>Best regards,<br/>Aura Team</p>
        `,
      });
      this.logger.log(`Demo request email sent to ${tutorEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${tutorEmail}`, error);
    }
  }

  async sendDemoAcceptedEmail(studentEmail: string, tutorName: string, meetingLink: string) {
    try {
      if (!process.env.SMTP_USER) {
        this.logger.warn(`Email simulated to ${studentEmail}: Demo accepted by ${tutorName}. Link: ${meetingLink}`);
        return;
      }

      await this.transporter.sendMail({
        from: `"Aura Edu" <${process.env.SMTP_FROM || 'noreply@auraedu.com'}>`,
        to: studentEmail,
        subject: 'Demo Request Accepted! 🎉',
        html: `
          <h3>Hello!</h3>
          <p>Great news! <strong>${tutorName}</strong> has accepted your demo request.</p>
          <p>Here is your meeting link: <a href="${meetingLink}">${meetingLink}</a></p>
          <p>We hope you have a great session!</p>
          <p>Best regards,<br/>Aura Team</p>
        `,
      });
      this.logger.log(`Demo accepted email sent to ${studentEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${studentEmail}`, error);
    }
  }
}
