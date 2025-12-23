import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.ROLE,
})
export class Role {
  @Prop()
  role: string;

  @Prop()
  role_slug: string;

  @Prop()
  slug: string;

  @Prop()
  is_active: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt: Date | null;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
