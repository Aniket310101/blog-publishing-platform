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
      currentBlogPost?.author?.id,
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

  async updateBlogPostStatus(
    status: string,
    id: string,
    token: string,
  ): Promise<void> {
    // Validate status
    const updatedStatus: BlogStatusEnums = this.getBlogStatus(status);
    if (!updatedStatus)
      throw new ErrorHandler(ErrorCodeEnums.BAD_REQUEST, 'Invalid status!');
    // Check permission
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
      currentBlogPost?.author?.id,
    );
    if (!hasUpdatePermission) {
      throw new ErrorHandler(
        ErrorCodeEnums.BAD_REQUEST,
        'User does not have permission to perform this operation!',
      );
    }
    const currentStatus: BlogStatusEnums = currentBlogPost.status;
    if (
      currentStatus === updatedStatus &&
      updatedStatus !== BlogStatusEnums.DRAFT
    ) {
      throw new ErrorHandler(
        ErrorCodeEnums.BAD_REQUEST,
        `This post is already in ${updatedStatus} state!`,
      );
    }
    // update data
    const updatedData = new BlogPostModel({ status: updatedStatus });
    if (updatedStatus === BlogStatusEnums.PUBLISHED)
      updatedData.publishedAt = new DatetimeHelper().getCurrentTimestamp();
    if (updatedStatus === BlogStatusEnums.DRAFT)
      updatedData.draftedAt = new DatetimeHelper().getCurrentTimestamp();
    if (updatedStatus === BlogStatusEnums.ARCHIVED)
      updatedData.archivedAt = new DatetimeHelper().getCurrentTimestamp();
    await blogPostRepository.updateBlogPost(updatedData, id);
  }

  async deleteBlogPost(id: string, token: string): Promise<void> {
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
      currentBlogPost?.author?.id,
    );
    if (!hasUpdatePermission) {
      throw new ErrorHandler(
        ErrorCodeEnums.BAD_REQUEST,
        'User does not have permission to perform this operation!',
      );
    }
    await blogPostRepository.deleteBlogPost(id);
  }

  private setAuditDetails(blogPost: BlogPostModel, token: string) {
    blogPost.author = new JwtHelper().decode(token);
    if (blogPost.status === BlogStatusEnums.PUBLISHED) {
      blogPost.publishedAt = new DatetimeHelper().getCurrentTimestamp();
    } else if (blogPost.status === BlogStatusEnums.DRAFT) {
      blogPost.draftedAt = new DatetimeHelper().getCurrentTimestamp();
    } else if (blogPost.status === BlogStatusEnums.ARCHIVED) {
      blogPost.archivedAt = new DatetimeHelper().getCurrentTimestamp();
    }
  }

  private getBlogStatus(statusString: string): BlogStatusEnums {
    let status: BlogStatusEnums;
    switch (statusString.toUpperCase()) {
      case BlogStatusEnums.PUBLISHED:
        status = BlogStatusEnums.PUBLISHED;
        break;
      case BlogStatusEnums.DRAFT:
        status = BlogStatusEnums.DRAFT;
        break;
      case BlogStatusEnums.ARCHIVED:
        status = BlogStatusEnums.ARCHIVED;
        break;
    }
    return status;
  }

  private checkAuthorAccess(token: string, authorId: string): boolean {
    const tokenInfo: AuthTokenModel = new JwtHelper().decode(token);
    const userId = tokenInfo.id;
    return userId === authorId;
  }
}
