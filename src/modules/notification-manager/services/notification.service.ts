import EmailProvider from '../../common/sendgrid-email/email-provider';
import UserModel from '../../identity/models/user.model';
import SubjectLineEnums from '../subject-line.enums';

export default class NotificationService {
  async sendBlogPublishEmailNotifications(
    subscribers: UserModel[],
    author: string,
    blogPostTitle: string,
    subjectLine: SubjectLineEnums,
  ) {
    await Promise.all(
      subscribers?.map((subscriber) => {
        new EmailProvider().sendEmail([subscriber.email], {
          author,
          blogPostTitle,
          subjectLine,
        });
      }),
    );
  }
}
