import { IBaseDocumentModel } from '@/types/mongoose.types';
import { Document, model, Schema } from 'mongoose';

export interface IUserAuditLog extends Document, IBaseDocumentModel {
  user: Schema.Types.ObjectId;
  action: string;
  description: string;
  ip_address: string;
  user_agent: string;
}

const userAuditLogSchema = new Schema<IUserAuditLog>(
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
  },
);

export const User_AuditLog = model<IUserAuditLog>('User_AuditLog', userAuditLogSchema);
