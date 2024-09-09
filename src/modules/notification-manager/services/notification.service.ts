import ErrorHandler from '../../common/errors/error-handler';
import { ErrorCodeEnums } from '../../common/errors/error.enums';
import EmailProvider from '../../common/sendgrid-email/email-provider';
import NotificationEventTypeEnums from '../enums/notification-event-type.enums';
import EmailNotificationModel from '../models/email-notification.model';
import { emailNotificationRequestPayload } from '../payloads/email-notification.request.payload';

export default class NotificationService {
  async sendEmailNotifications(
    payload: typeof emailNotificationRequestPayload,
  ) {
    const notificationModel = new EmailNotificationModel(payload);
    if (
      notificationModel.eventType ===
      NotificationEventTypeEnums.BLOG_PUBLISH_SUBSCRIBER_EVENT
    ) {
      await this.sendBlogPublishSubscriberEmailNotifications(
        notificationModel.recepients,
        notificationModel.emailContent,
        notificationModel.ccRecepients,
      );
    }
  }

  async sendBlogPublishSubscriberEmailNotifications(
    subscribers: string[],
    emailContent,
    ccRecepients: string[] = [],
  ) {
    if (!subscribers || subscribers?.length === 0) {
      throw new ErrorHandler(
        ErrorCodeEnums.BAD_REQUEST,
        'Missing Parameters: List of Recepient Emails is missing!',
      );
    }
    if (
      !emailContent.author ||
      !emailContent.blogPostTitle ||
      !emailContent.subjectLine
    ) {
      throw new ErrorHandler(
        ErrorCodeEnums.BAD_REQUEST,
        'Missing Parameters: author, blogPostTitle, subjectLine are required!',
      );
    }
    await Promise.all(
      subscribers?.map((subscriber) => {
        new EmailProvider().sendEmail(
          [subscriber],
          emailContent,
          process.env.SENDGRID_BLOG_PUBLISH_SUBSCRIBER_NOTIFICATION_TEMPLATE_ID,
          ccRecepients,
        );
      }),
    );
  }
}
