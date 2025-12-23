import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import { User } from '../../user/schema/user.schema';

export type AddressDocument = HydratedDocument<Address>;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: MONGOOSE_MODELS.ADDRESS,
})
export class Address extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: MONGOOSE_MODELS.USER,
    required: true,
    index: true,
  })
  user: Types.ObjectId | User;

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
