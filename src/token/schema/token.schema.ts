import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { User } from '../../user/schema/user.schema';
import { TokenTypes } from '../enums/token-enum';

export type TokenDocument = HydratedDocument<Token>;
export type DeviceInfoDocument = HydratedDocument<DeviceInfo>;

export class DeviceInfo {
  @Prop({
    type: String,
  })
  device_id: string;

  @Prop({
    type: String,
  })
  device_type: string;

  @Prop({
    type: Object,
  })
  os: {
    name: string;
    version: string;
  };

  @Prop({
    type: Object,
  })
  browser: {
    name: string;
    version: string;
  };

  @Prop({
    type: String,
  })
  brand: string;

  @Prop({
    type: String,
  })
  model: string;

  @Prop({
    type: String,
  })
  user_agent: string;
}

export const DeviceInfoSchema = SchemaFactory.createForClass(DeviceInfo);

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Token {
  @Prop({
    type: String,
    required: true,
    index: true,
  })
  token: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: Types.ObjectId | User;

  @Prop({
    type: [DeviceInfoSchema],
  })
  device_info: DeviceInfo;

  @Prop({
    type: String,
    enum: Object.values(TokenTypes),
    required: true,
  })
  type: string;

  @Prop({
    type: Date,
    required: true,
  })
  expires: Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  blacklisted: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
