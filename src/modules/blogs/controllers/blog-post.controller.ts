import { Request, Response, NextFunction } from 'express';
import { createBlogPostRequestPayload } from '../payloads/create-blog-post.request.payload';
import JoiValidation from '../../common/joi-validation/joi-validation';
import JwtHelper from '../../common/helpers/jwt.helper';
import BlogPostService from '../services/blog-post.service';
import { updateBlogPostRequestPayload } from '../payloads/update-blog-post.request.payload';

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

  async updateBlogPost(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as string;
    const payload: typeof updateBlogPostRequestPayload =
      new JoiValidation().extractAndValidate<
        typeof updateBlogPostRequestPayload
      >(req.body, updateBlogPostRequestPayload);
    const jwtHelper = new JwtHelper();
    const token = jwtHelper.extractTokenFromHeader(req.headers.authorization);
    await new BlogPostService().updateBlogPost(payload, id, token);
    res.status(204).send();
  }

  async deleteBlogPost(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as string;
    const jwtHelper = new JwtHelper();
    const token = jwtHelper.extractTokenFromHeader(req.headers.authorization);
    await new BlogPostService().deleteBlogPost(id, token);
    res.status(204).send();
  }

  async updateBlogPostStatus(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as string;
    const status = req.params.status as string;
    const jwtHelper = new JwtHelper();
    const token = jwtHelper.extractTokenFromHeader(req.headers.authorization);
    await new BlogPostService().updateBlogPostStatus(status, id, token);
    res.status(204).send();
  }
}
