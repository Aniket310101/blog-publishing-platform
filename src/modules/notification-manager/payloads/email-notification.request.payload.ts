import Joi from 'joi';
import NotificationEventTypeEnums from '../enums/notification-event-type.enums';

export const emailNotificationRequestPayload = Joi.object({
  eventType: Joi.string()
    .valid(...Object.values(NotificationEventTypeEnums))
    .required(),
  recepients: Joi.array().items(Joi.string()).min(1).required(),
  ccRecepients: Joi.array().items(Joi.string()).optional(),
  emailContent: Joi.object().required(),
});
