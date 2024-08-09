import Joi from 'joi';
import { mediaRequestPayload } from './media.request.payload';

export const updateBlogPostRequestPayload = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  content: Joi.string().min(1).optional(),
  summary: Joi.string().min(1).max(500).optional(),
  media: Joi.object().keys(mediaRequestPayload).optional().allow(null),
});
