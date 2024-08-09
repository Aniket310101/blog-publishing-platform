export default class DocumentModel {
  fileKey: string;
  url: string;
  filename: string;
  size: number;
  mimetype: string;

  constructor(data: any) {
    this.fileKey = data.fileKey;
    this.url = data.url;
    this.filename = data.filename;
    this.size = data.size;
    this.mimetype = data.mimetype;
  }
}
