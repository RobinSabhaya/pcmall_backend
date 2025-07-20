import { IBaseDocumentModel } from "@/types/mongoose.types";
import { Document, model, Schema } from "mongoose";

export interface ILoginHistory extends Document { 
  ip_address: string;
  device: string;
  logged_in_at: Date;
}
export interface IUserSecurity extends Document,IBaseDocumentModel { 
  user: Schema.Types.ObjectId;
  two_factor_enabled: boolean;
  login_history: ILoginHistory[];
  failed_attempts: number;
  lockout_time: Date;
} 

const loginHistorySchema = new Schema<ILoginHistory>(
  {
    ip_address: {
      type: String,
    },
    device: { type: String },
    logged_in_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userSecuritySchema = new Schema<IUserSecurity>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    two_factor_enabled: {
      type: Boolean,
      default: false,
    },
    login_history: {
      type: [loginHistorySchema],
      default: [],
    },
    failed_attempts: {
      type: Number,
      default: 0,
    },
    lockout_time: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User_Security = model<IUserSecurity>('User_Security', userSecuritySchema);
