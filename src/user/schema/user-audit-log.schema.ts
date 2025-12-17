import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

import { User } from './user.schema';

export type UserAuditLogDocument = HydratedDocument<UserAuditLog>;

@Schema({ timestamps: true, versionKey: false })
export class UserAuditLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: User;

  @Prop()
  action: string;

  @Prop()
  description: string;

  @Prop()
  ip_address: string;

  @Prop()
  user_agent: string;
}

export const UserAuditLogSchema = SchemaFactory.createForClass(UserAuditLog);
