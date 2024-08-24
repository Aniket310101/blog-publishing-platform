import ErrorHandler from '../../common/errors/error-handler';
import { ErrorCodeEnums } from '../../common/errors/error.enums';
import JwtHelper from '../../common/helpers/jwt.helper';
import UserModel from '../../identity/models/user.model';
import IdentityService from '../../identity/services/identity.service';

export default class SubscriptionService {
  private static identityService: IdentityService;

  constructor() {
    SubscriptionService.identityService = new IdentityService();
  }

  async subscribeToAnAuthor(authorId: string, userId: string) {
    if (userId === authorId) {
      throw new ErrorHandler(
        ErrorCodeEnums.BAD_REQUEST,
        'Subscription not allowed!',
      );
    }
    // Fetch both user and author
    const [author, user] = await Promise.all([
      this.getUser(authorId),
      this.getUser(userId),
    ]);
    if (!author || !user) {
      throw new ErrorHandler(
        ErrorCodeEnums.BAD_REQUEST,
        `${!author ? 'Author' : 'User'} not found! ${!author ? 'Author' : 'User'} must be active!`,
      );
    }
    const subscriptions = user.subscriptions ?? [];
    if (this.isAlreadySubscribed(authorId, subscriptions)) {
      throw new ErrorHandler(
        ErrorCodeEnums.BAD_REQUEST,
        'User is already subscribed!',
      );
    }
    // Update subscriptions and subscribers
    subscriptions.push({
      id: authorId,
      email: author.email,
      username: author.username,
    });
    const subscribers = author.subscribers ?? [];
    subscribers.push({
      id: userId,
      email: user.email,
      username: user.username,
    });
    // Update both user and author
    await Promise.all([
      SubscriptionService.identityService.updateUser(userId, { subscriptions }),
      SubscriptionService.identityService.updateUser(authorId, { subscribers }),
    ]);
  }

  async unsubscribeAnAuthor(authorId: string, userId: string) {
    if (userId === authorId) {
      throw new ErrorHandler(
        ErrorCodeEnums.BAD_REQUEST,
        'Cannot be unsubscribed!',
      );
    }
    // Fetch both user and author
    const [author, user] = await Promise.all([
      this.getUser(authorId),
      this.getUser(userId),
    ]);
    if (!author || !user) {
      throw new ErrorHandler(
        ErrorCodeEnums.BAD_REQUEST,
        `${!author ? 'Author' : 'User'} not found! ${!author ? 'Author' : 'User'} must be active!`,
      );
    }
    const subscriptions = user.subscriptions ?? [];
    if (!this.isAlreadySubscribed(authorId, subscriptions)) {
      throw new ErrorHandler(
        ErrorCodeEnums.BAD_REQUEST,
        'User is already unsubscribed!',
      );
    }
    // Update subscriptions and subscribers
    const updatedSubscriptions = subscriptions.filter(
      (subscription) => subscription.id !== authorId,
    );
    const subscribers = author.subscribers ?? [];
    const updatedSubscribers = subscribers.filter(
      (subscriber) => subscriber.id !== userId,
    );
    subscribers.push({
      id: userId,
      email: user.email,
      username: user.username,
    });
    // Update both user and author
    await Promise.all([
      SubscriptionService.identityService.updateUser(userId, {
        subscriptions: updatedSubscriptions,
      }),
      SubscriptionService.identityService.updateUser(authorId, {
        subscribers: updatedSubscribers,
      }),
    ]);
  }

  async getSubscriptionInfo(id: string): Promise<UserModel> {
    const userInfo: UserModel = await this.getUser(id);
    if (!userInfo)
      throw new ErrorHandler(ErrorCodeEnums.BAD_REQUEST, 'User Not Found!');
    const responseModel: UserModel = {
      subscribers: userInfo.subscribers ?? [],
      subscriptions: userInfo.subscriptions ?? [],
    };
    return responseModel;
  }

  private async getUser(id: string): Promise<UserModel> {
    const user: UserModel =
      await SubscriptionService.identityService.getUserById(id);
    return user;
  }

  private isAlreadySubscribed(
    authorId: string,
    subscriptions: UserModel[],
  ): boolean {
    const check = subscriptions.some(
      (subscription) => subscription.id === authorId,
    );
    return check;
  }
}
