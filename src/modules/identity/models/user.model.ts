export default class UserModel {
  id?: string;
  username?: string;
  password?: string;
  email?: string;
  subscribers?: UserModel[];
  subscriptions?: UserModel[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: any) {
    this.id = data.id ?? data._id;
    this.username = data.username;
    this.password = data.password;
    this.email = data.email;
    this.subscribers = data.subscribers;
    this.subscriptions = data.subscriptions;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
