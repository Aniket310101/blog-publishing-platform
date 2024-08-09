import mongoose from 'mongoose';
import BlogPostModel from '../models/blog-post.model';
import blogPostSchema from '../../common/datastore/schemas/blog-post.schema';
import BaseDatastore from '../../common/datastore/base-datastore';
import ErrorHandler from '../../common/errors/error-handler';
import { ErrorCodeEnums } from '../../common/errors/error.enums';

export default class BlogPostRepository extends BaseDatastore {
  private dbInstance: mongoose.Model<typeof blogPostSchema>;

  constructor() {
    super();
    this.dbInstance = BaseDatastore.BlogPostsDB
      ? BaseDatastore.BlogPostsDB
      : undefined;
    if (!this.dbInstance)
      throw new ErrorHandler(
        ErrorCodeEnums.INTERNAL_SERVER_ERROR,
        'DB Issue in blog_posts Collection!',
      );
  }
  async createBlogPost(blogPost: BlogPostModel): Promise<BlogPostModel> {
    let dbData;
    try {
      dbData = await new this.dbInstance(blogPost).save();
    } catch (err) {
      throw new ErrorHandler(ErrorCodeEnums.BAD_REQUEST, err as string);
    }
    const newBlogPost = new BlogPostModel(dbData);
    return newBlogPost;
  }
}
