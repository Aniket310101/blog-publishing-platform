import { Router } from 'express';
import { asyncHandler } from '../modules/common/errors/async-handler';
import AuthMiddleware from '../modules/common/auth/auth.middleware';
import NotificationController from '../modules/notification-manager/controllers/notification.controller';

const notificationRouter = Router();
const notificationController = new NotificationController();

notificationRouter.post(
  '/',
  //   asyncHandler(new AuthMiddleware().verify),
  asyncHandler(notificationController.sendEmailNotifications),
);

export default notificationRouter;
