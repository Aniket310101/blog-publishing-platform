import { Request, Response, NextFunction } from 'express';
import NotificationService from '../services/notification.service';
import { emailNotificationRequestPayload } from '../payloads/email-notification.request.payload';
import JoiValidation from '../../common/joi-validation/joi-validation';

export default class NotificationController {
  async sendEmailNotifications(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    // const authorId = req.params.authorId as string;
    // const jwtHelper = new JwtHelper();
    // const token = jwtHelper.extractTokenFromHeader(req.headers.authorization);
    // const userId = new JwtHelper().decode(token).id;
    const payload: typeof emailNotificationRequestPayload =
      new JoiValidation().extractAndValidate<
        typeof emailNotificationRequestPayload
      >(req.body, emailNotificationRequestPayload);
    await new NotificationService().sendEmailNotifications(payload);
    res.status(204).send();
  }
}
