import { Request, Response, NextFunction } from 'express';
import JwtHelper from '../../common/helpers/jwt.helper';
import SubscriptionService from '../services/subscription.service';

export default class SubscriptionController {
  async subscribeToAnAuthor(req: Request, res: Response, next: NextFunction) {
    const authorId = req.params.authorId as string;
    const jwtHelper = new JwtHelper();
    const token = jwtHelper.extractTokenFromHeader(req.headers.authorization);
    const userId = new JwtHelper().decode(token).id;
    await new SubscriptionService().subscribeToAnAuthor(authorId, userId);
    res.status(204).send();
  }

  async unsubscribeAnAuthor(req: Request, res: Response, next: NextFunction) {
    const authorId = req.params.authorId as string;
    const jwtHelper = new JwtHelper();
    const token = jwtHelper.extractTokenFromHeader(req.headers.authorization);
    const userId = new JwtHelper().decode(token).id;
    await new SubscriptionService().unsubscribeAnAuthor(authorId, userId);
    res.status(204).send();
  }

  async getSubscriptionInfo(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as string;
    const response = await new SubscriptionService().getSubscriptionInfo(id);
    res.send(response);
  }
}
