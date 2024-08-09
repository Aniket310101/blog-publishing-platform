import DatetimeHelper from '../../common/helpers/date-time.helper';
import JwtHelper from '../../common/helpers/jwt.helper';
import { BlogStatusEnums } from '../enums/blog-status.enums';
import BlogPostModel from '../models/blog-post.model';
import { createBlogPostRequestPayload } from '../payloads/create-blog-post.request.payload';
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

  private setAuditDetails(blogPost: BlogPostModel, token: string) {
    blogPost.author = new JwtHelper().decode(token);
    blogPost.publishedAt = new DatetimeHelper().getCurrentTimestamp();
  }

  private updateBlogStatus(blogPost: BlogPostModel, status: BlogStatusEnums) {
    blogPost.status = status;
  }
}
