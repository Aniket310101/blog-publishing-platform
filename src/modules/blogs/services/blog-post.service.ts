import ErrorHandler from '../../common/errors/error-handler';
import { ErrorCodeEnums } from '../../common/errors/error.enums';
import DatetimeHelper from '../../common/helpers/date-time.helper';
import JwtHelper from '../../common/helpers/jwt.helper';
import AuthTokenModel from '../../common/models/auth-token-model';
import { BlogStatusEnums } from '../enums/blog-status.enums';
import BlogPostModel from '../models/blog-post.model';
import { createBlogPostRequestPayload } from '../payloads/create-blog-post.request.payload';
import { updateBlogPostRequestPayload } from '../payloads/update-blog-post.request.payload';
import BlogPostRepository from '../repositories/blog-post.repository';

export default class BlogPostService {
  async createBlogPost(
    payload: typeof createBlogPostRequestPayload,
    token: string,
  ): Promise<BlogPostModel> {
    const blogPost: BlogPostModel = new BlogPostModel(payload);
    this.setAuditDetails(blogPost, token);
    this.updateBlogStatus(blogPost, BlogStatusEnums.PUBLISHED);
    const newBlogPost: BlogPostModel =
      await new BlogPostRepository().createBlogPost(blogPost);
    return newBlogPost;
  }

  async updateBlogPost(
    payload: typeof updateBlogPostRequestPayload,
    id: string,
    token: string,
  ): Promise<void> {
    const blogPostRepository = new BlogPostRepository();
    const currentBlogPost = await blogPostRepository.getBlogPost(id);
    if (!currentBlogPost)
      throw new ErrorHandler(
        ErrorCodeEnums.BAD_REQUEST,
        'Blog Post not found!',
      );
    // Check for author access
    const hasUpdatePermission: boolean = this.checkAuthorAccess(
      token,
      currentBlogPost,
    );
    if (!hasUpdatePermission) {
      throw new ErrorHandler(
        ErrorCodeEnums.BAD_REQUEST,
        'User does not have permission to perform this operation!',
      );
    }
    // update data
    const updatedData = new BlogPostModel(payload);
    await blogPostRepository.updateBlogPost(updatedData, id);
  }

  private setAuditDetails(blogPost: BlogPostModel, token: string) {
    blogPost.author = new JwtHelper().decode(token);
    blogPost.publishedAt = new DatetimeHelper().getCurrentTimestamp();
  }

  private updateBlogStatus(blogPost: BlogPostModel, status: BlogStatusEnums) {
    blogPost.status = status;
  }

  private checkAuthorAccess(token: string, blogPost: BlogPostModel): boolean {
    const tokenInfo: AuthTokenModel = new JwtHelper().decode(token);
    const userId = tokenInfo.id;
    const authorId = blogPost?.author?.id;
    return userId === authorId;
  }
}
