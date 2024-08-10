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

  async updateBlogPost(
    updatedData: BlogPostModel,
    id: string,
  ): Promise<BlogPostModel> {
    let result;
    try {
      result = await this.dbInstance.updateOne(
        { _id: id },
        { $set: updatedData },
      );
      if (result.matchedCount === 0) {
        throw new ErrorHandler(
          ErrorCodeEnums.BAD_REQUEST,
          'No blog post found with the given ID.',
        );
      }
    } catch (err) {
      throw new ErrorHandler(ErrorCodeEnums.BAD_REQUEST, err as string);
    }
    const updatedBlogPost = result ? new BlogPostModel(result) : undefined;
    return updatedBlogPost;
  }

  async getBlogPost(id: string): Promise<BlogPostModel | undefined> {
    let blogPost;
    try {
      blogPost = await this.dbInstance.findOne({ _id: id });
    } catch (err) {
      throw new ErrorHandler(ErrorCodeEnums.BAD_REQUEST, err as string);
    }
    const blogPostModel = blogPost ? new BlogPostModel(blogPost) : undefined;
    return blogPostModel;
  }

  async deleteBlogPost(id: string): Promise<void> {
    try {
      await this.dbInstance.deleteOne({ _id: id });
    } catch (err) {
      throw new ErrorHandler(ErrorCodeEnums.BAD_REQUEST, err as string);
    }
  }
}
