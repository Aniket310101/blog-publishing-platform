import { Router } from 'express';
import { asyncHandler } from '../modules/common/errors/async-handler';
import AuthMiddleware from '../modules/common/auth/auth.middleware';
import SubscriptionController from '../modules/subscription-service/controllers/subscription.controller';

const subscriptionRouter = Router();
const subscriptionController = new SubscriptionController();

subscriptionRouter.put(
  '/:authorId',
  asyncHandler(new AuthMiddleware().verify),
  asyncHandler(subscriptionController.subscribeToAnAuthor),
);

subscriptionRouter.put(
  '/unsubscribe/:authorId',
  asyncHandler(new AuthMiddleware().verify),
  asyncHandler(subscriptionController.unsubscribeAnAuthor),
);

subscriptionRouter.get(
  '/:id',
  asyncHandler(new AuthMiddleware().verify),
  asyncHandler(subscriptionController.getSubscriptionInfo),
);

export default subscriptionRouter;
