import { v4 as uuidv4 } from 'uuid';

const documentSchema = {
  fileKey: { type: String, required: true },
  url: { type: String, required: true },
  fileName: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
};

export default documentSchema;
