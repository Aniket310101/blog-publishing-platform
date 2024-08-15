import mongoose, { FilterQuery } from 'mongoose';
import BlogPostModel from '../models/blog-post.model';
import blogPostSchema from '../../common/datastore/schemas/blog-post.schema';
import BaseDatastore from '../../common/datastore/base-datastore';
import ErrorHandler from '../../common/errors/error-handler';
import { ErrorCodeEnums } from '../../common/errors/error.enums';
import facetFieldMapping from '../services/utils';
import SearchBlogPostModel from '../models/search-blog-post.model';

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
      blogPost = await this.dbInstance.findById(id);
    } catch (err) {
      throw new ErrorHandler(ErrorCodeEnums.BAD_REQUEST, err as string);
    }
    const blogPostModel = blogPost ? new BlogPostModel(blogPost) : undefined;
    return blogPostModel;
  }

  async findBlogPosts(
    filters,
    sortOptions,
    limit?: number,
    skip?: number,
  ): Promise<BlogPostModel[]> {
    let results;
    try {
      let query = this.dbInstance.find(filters).sort(sortOptions);
      if (typeof limit === 'number' && limit > 0) {
        query = query.limit(limit);
      }
      if (typeof skip === 'number' && skip >= 0) {
        query = query.skip(skip);
      }
      results = await query;
    } catch (err) {
      throw new ErrorHandler(ErrorCodeEnums.BAD_REQUEST, err as string);
    }
    const blogPosts: BlogPostModel[] = [];
    results.forEach((post) => blogPosts.push(new BlogPostModel(post)));
    return blogPosts;
  }

  async deleteBlogPost(id: string): Promise<void> {
    try {
      await this.dbInstance.deleteOne({ _id: id });
    } catch (err) {
      throw new ErrorHandler(ErrorCodeEnums.BAD_REQUEST, err as string);
    }
  }

  async searchBlogPosts(payload: SearchBlogPostModel) {
    const { query, filters, sort, limit, skip } = payload;
    const queryPipeline = [];
    const compoundOperators: any = {};
    compoundOperators.must = query?.trim()
      ? [
          {
            text: {
              query: query,
              path: {
                wildcard: '*',
              },
            },
          },
        ]
      : [
          {
            exists: {
              path: '_id', // Matches all documents by checking if _id exists
            },
          },
        ];
    const sortClause = sort ? sort : { createdAt: -1 };
    if (filters) compoundOperators.filter = this.transformFilterClause(filters);
    const searchQuery = {
      $search: {
        index: 'default',
        compound: compoundOperators,
        sort: sortClause,
      },
    };
    queryPipeline.push(searchQuery);
    if (limit) queryPipeline.push({ $limit: limit }); // limit must >0
    if (skip !== undefined) queryPipeline.push({ $skip: skip });
    const searchQueryResultPromise = this.dbInstance.aggregate(queryPipeline);
    const facetQueryResultPromise = this.getFacets();
    const [searchResults, facetResults] = await Promise.all([
      searchQueryResultPromise,
      facetQueryResultPromise,
    ]).catch((e) => {
      throw new ErrorHandler(
        ErrorCodeEnums.INTERNAL_SERVER_ERROR,
        `Error: ${e}`,
      );
    });
    const blogPostModels = searchResults?.map(
      (result) => new BlogPostModel(result),
    );
    return { facets: facetResults, blogPosts: blogPostModels };
  }

  async getFacets() {
    const facetResults = await this.dbInstance.aggregate([
      {
        $searchMeta: {
          index: 'default',
          facet: {
            facets: facetFieldMapping,
          },
          count: {
            type: 'total',
          },
        },
      },
    ]);
    return facetResults;
  }

  private transformFilterClause(filters) {
    const compoundClause: any = {};
    const mustClause = [];
    const shouldClause = [];
    Object.keys(filters).forEach((key) => {
      const facetFieldMap = facetFieldMapping[key];
      if (facetFieldMap) {
        const path = facetFieldMap.path;
        if (filters[key].length === 1) {
          const clause = {};
          clause['equals'] = {
            path,
            value: filters[key][0],
          };
          mustClause.push(clause);
        } else if (filters[key].length > 1) {
          filters[key]?.forEach((value: string) => {
            const clause = {};
            clause['equals'] = {
              path,
              value,
            };
            shouldClause.push(clause);
          });
        }
      }
    });
    if (mustClause.length === 0 && shouldClause.length === 0) return undefined;
    if (mustClause.length > 0) compoundClause.must = mustClause;
    if (shouldClause.length > 0) {
      compoundClause.should = shouldClause;
      compoundClause.minimumShouldMatch = 1;
    }
    return { compound: compoundClause };
  }
}
