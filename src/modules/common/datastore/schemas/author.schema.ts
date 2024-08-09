import { v4 as uuidv4 } from 'uuid';

const authorSchema = {
  id: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
};

export default authorSchema;
