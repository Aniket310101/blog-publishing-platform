import { PubSub } from '@google-cloud/pubsub';
import EmailNotificationModel from '../../notification-manager/models/email-notification.model';
import ErrorHandler from '../errors/error-handler';
import { ErrorCodeEnums } from '../errors/error.enums';
import path from 'path';

export default class PubSubHandlerClass {
  async publishEmailNotification(payload: EmailNotificationModel) {
    const pubsub = new PubSub();
    const credentialsPath = path.resolve(
      __dirname,
      '../../../../gcp_creds.json',
    );
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
    const messageString = JSON.stringify(payload);
    const dataBuffer = Buffer.from(messageString);
    try {
      const messageId = await pubsub
        .topic(process.env.PUBSUB_TOPIC)
        .publishMessage({ data: dataBuffer });
      console.log(`Message ${messageId} published.`);
    } catch (error) {
      throw new ErrorHandler(
        ErrorCodeEnums.BAD_REQUEST,
        `Error publishing message for ${payload.eventType} event: ${error}`,
      );
    }
  }
}
