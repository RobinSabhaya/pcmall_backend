import { Document } from 'mongoose';

export interface IBaseDocumentModel extends Document {
  createdAt: Date;
  updatedAt: Date;
}
