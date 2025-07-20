import { IBaseDocumentModel } from '@/types/mongoose.types';
import { model, Schema, Document } from 'mongoose'

export interface IAccessPermission extends Document, IBaseDocumentModel {
    role: Schema.Types.ObjectId
    permission: Schema.Types.ObjectId
}

const accessPermissionSchema = new Schema<IAccessPermission>(
    {
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: true,
        },
        permission: {
            type: Schema.Types.ObjectId,
            ref: 'Permission',
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


export const accessPermission = model<IAccessPermission>('Access_permission', accessPermissionSchema);

