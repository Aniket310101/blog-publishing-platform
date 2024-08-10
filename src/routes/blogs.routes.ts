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

blogRouter.put(
  '/:id',
  asyncHandler(new AuthMiddleware().verify),
  asyncHandler(blogController.updateBlogPost),
);

blogRouter.put(
  '/:id/status/:status',
  asyncHandler(new AuthMiddleware().verify),
  asyncHandler(blogController.updateBlogPostStatus),
);

blogRouter.delete(
  '/:id',
  asyncHandler(new AuthMiddleware().verify),
  asyncHandler(blogController.deleteBlogPost),
);

export default blogRouter;
