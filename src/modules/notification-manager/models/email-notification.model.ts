import NotificationEventTypeEnums from '../enums/notification-event-type.enums';

export default class EmailNotificationModel {
  eventType?: NotificationEventTypeEnums;

  recepients?: string[];

  ccRecepients?: string[];

  emailContent?;

  constructor(data) {
    this.eventType = data.eventType;
    this.recepients = data.recepients;
    this.ccRecepients = data.ccRecepients;
    this.emailContent = data.emailContent;
  }
}
