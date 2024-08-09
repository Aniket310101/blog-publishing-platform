import Joi from 'joi';

export const mediaRequestPayload = {
  fileKey: Joi.string().min(1).required(),
  url: Joi.string().uri().min(1).required(),
  fileName: Joi.string().min(1).required(),
  size: Joi.number().min(1).required(),
  mimetype: Joi.string().min(1).required(),
};
