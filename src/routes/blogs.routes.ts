import { Router } from 'express';
import { asyncHandler } from '../modules/common/errors/async-handler';
import AuthMiddleware from '../modules/common/auth/auth.middleware';
import BlogPostController from '../modules/blogs/controllers/blog-post.controller';

const blogRouter = Router();
const blogController = new BlogPostController();

blogRouter.post(
  '/',
  asyncHandler(new AuthMiddleware().verify),
  asyncHandler(blogController.createBlogPost),
);

export default blogRouter;
