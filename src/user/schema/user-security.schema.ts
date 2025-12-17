import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { User } from './user.schema';

export type UserSecurityDocument = HydratedDocument<UserSecurity>;
export type LoginHistoryDocument = HydratedDocument<LoginHistory>;

@Schema({ _id: false })
export class LoginHistory {
  @Prop()
  ip_address: string;

  @Prop()
  device: string;

  @Prop({ default: Date.now })
  logged_in_at: Date;
}

export const LoginHistorySchema = SchemaFactory.createForClass(LoginHistory);

@Schema({ timestamps: true, versionKey: false })
export class UserSecurity {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: User;

  @Prop({ default: false })
  two_factor_enabled: boolean;

  @Prop({ type: [LoginHistorySchema], default: [] })
  login_history: LoginHistory[];

  @Prop({ default: 0 })
  failed_attempts: number;

  @Prop()
  lockout_time: Date;
}

export const UserSecuritySchema = SchemaFactory.createForClass(UserSecurity);
