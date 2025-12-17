import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  versionKey: false,
  timestamps: true,
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
