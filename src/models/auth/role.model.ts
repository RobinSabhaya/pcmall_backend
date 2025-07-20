import { IBaseDocumentModel } from '@/types/mongoose.types'
import { model, Schema, Document } from 'mongoose'

export interface IRole extends Document,IBaseDocumentModel {
    role: string
    role_slug: string
    slug: string
    is_active: boolean
    deletedAt: Date | null
}

const roleSchema = new Schema<IRole>(
    {
        role: {
            type: String,
            trim: true,
        },
        role_slug: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            trim: true,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true, versionKey: false }
);

export const Role = model('Role', roleSchema);
