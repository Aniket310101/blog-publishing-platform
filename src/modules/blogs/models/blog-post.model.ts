import AuthTokenModel from '../../common/models/auth-token-model';
import { BlogStatusEnums } from '../enums/blog-status.enums';
import DocumentModel from './document.model';

export default class BlogPostModel {
  id: string;
  title: string;
  summary: string;
  content: string;
  status: BlogStatusEnums;
  author: AuthTokenModel;
  media: DocumentModel;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id ?? data._id;
    this.title = data.title;
    this.content = data.content;
    this.summary = data.summary;
    this.status = data.status;
    this.author = data.author;
    this.media = data.media;
    this.publishedAt = data.publishedAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
