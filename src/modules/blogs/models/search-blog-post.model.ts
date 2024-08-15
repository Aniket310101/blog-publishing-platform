export default class SearchBlogPostModel {
  query: string;
  filters;
  limit: number;
  skip: number;
  sort;

  constructor(data: any) {
    this.query = data.query;
    this.filters = data.filters;
    this.limit = data.limit;
    this.skip = data.skip;
    this.sort = data.sort;
  }
}
