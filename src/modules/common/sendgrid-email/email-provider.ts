import sgMail from '@sendgrid/mail';
import ErrorHandler from '../errors/error-handler';
import { ErrorCodeEnums } from '../errors/error.enums';

export default class EmailProvider {
  static sendgridClient: sgMail.MailService;

  async initializeEmailProvider() {
    EmailProvider.sendgridClient = sgMail;
    EmailProvider.sendgridClient.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('SendGrid Email Provider Initialized!');
  }

  async sendEmail(
    to: string[],
    emailContent,
    templateId: string,
    cc: string[] = [],
  ) {
    const emailParams = {
      to,
      cc,
      from: {
        name: process.env.SENDGRID_SENDER_NAME,
        email: process.env.SENDGRID_SENDER_EMAIL,
      },
      templateId,
      dynamicTemplateData: emailContent,
    };
    try {
      await EmailProvider.sendgridClient.send(emailParams);
    } catch (error) {
      throw new ErrorHandler(
        ErrorCodeEnums.INTERNAL_SERVER_ERROR,
        `Error while sending email! Error: ${error}`,
      );
    }
  }
}
