import { Document, model, Schema } from 'mongoose';

import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface IUserAuditLog extends Document, IBaseDocumentModel {
  user: Schema.Types.ObjectId;
  action: string;
  description: string;
  ip_address: string;
  user_agent: string;
}

export const userAuditLogSchema = new Schema<IUserAuditLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: String,
    description: String,
    ip_address: String,
    user_agent: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const userAuditLog = model<IUserAuditLog>(
  'User_AuditLog',
  userAuditLogSchema
);
