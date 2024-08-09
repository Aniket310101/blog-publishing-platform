import { v4 as uuidv4 } from 'uuid';

const blogPostSchema = {
  _id: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String, required: true },
  publishedAt: { type: Date },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
  author: { type: Object, ref: 'authorSchema', required: true },
  media: { type: Object, ref: 'documentSchema' },
};

export default blogPostSchema;
