import Joi from 'joi';
import { mediaRequestPayload } from './media.request.payload';

export const createBlogPostRequestPayload = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  content: Joi.string().min(1).required(),
  summary: Joi.string().min(1).max(500).required(),
  media: Joi.object().keys(mediaRequestPayload).optional(),
});
