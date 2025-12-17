import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { User } from '../../user/schema/user.schema';

export type AddressDocument = HydratedDocument<Address>;

@Schema({ timestamps: true, versionKey: false })
export class Address {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: User;

  @Prop({ required: true })
  line1: string;

  @Prop()
  line2: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop()
  postalCode: string;

  @Prop({ required: true })
  country: string;

  @Prop({ default: false })
  isPrimary: boolean;

  // Uncomment if you want geo-location support
  // @Prop({
  //   type: {
  //     type: String,
  //     enum: ['Point'],
  //     default: 'Point',
  //   },
  //   coordinates: {
  //     type: [Number],
  //   },
  // })
  // geo_location: {
  //   type: string;
  //   coordinates: number[];
  // };
}

export const AddressSchema = SchemaFactory.createForClass(Address);

// Optional index
// AddressSchema.index({ geo_location: '2dsphere' });
