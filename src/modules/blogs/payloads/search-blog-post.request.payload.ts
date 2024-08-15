import Joi from 'joi';

export const searchBlogPostRequestPayload = Joi.object({
  query: Joi.string().min(1).optional(),
  filters: Joi.object().min(1).optional(),
  sort: Joi.object().min(1).optional(),
  limit: Joi.number().optional(),
  skip: Joi.number().optional(),
});
