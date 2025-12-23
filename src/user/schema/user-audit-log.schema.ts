import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';

export type UserAuditLogDocument = HydratedDocument<UserAuditLog>;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: MONGOOSE_MODELS.USER_AUDIT_LOG,
})
export class UserAuditLog {
  @Prop({
    type: mongoose.Schema.ObjectId,
    ref: MONGOOSE_MODELS.USER,
    required: true,
    index: true,
  })
  user: Types.ObjectId;

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
