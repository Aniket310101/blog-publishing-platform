import { Request, Response, NextFunction } from 'express';
import { createBlogPostRequestPayload } from '../payloads/create-blog-post.request.payload';
import JoiValidation from '../../common/joi-validation/joi-validation';
import JwtHelper from '../../common/helpers/jwt.helper';
import BlogPostService from '../services/blog-post.service';

export default class BlogPostController {
  async createBlogPost(req: Request, res: Response, next: NextFunction) {
    const payload: typeof createBlogPostRequestPayload =
      new JoiValidation().extractAndValidate<
        typeof createBlogPostRequestPayload
      >(req.body, createBlogPostRequestPayload);
    const jwtHelper = new JwtHelper();
    const token = jwtHelper.extractTokenFromHeader(req.headers.authorization);
    const response = await new BlogPostService().createBlogPost(payload, token);
    res.send(response);
  }
}
