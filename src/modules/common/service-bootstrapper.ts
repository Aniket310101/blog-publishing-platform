import AwsS3Provider from './aws-s3/aws-s3-provider';
import BaseDatastore from './datastore/base-datastore';
import EmailProvider from './sendgrid-email/email-provider';

export default class ServiceBootrapper {
  async initialize() {
    await new BaseDatastore().initializeDB(); // DB initialize
    await new AwsS3Provider().initialize(); // AWS S3 Client initialize
    await new EmailProvider().initializeEmailProvider(); // SendGrid Email Provider initialize
  }
}
