import { Schema, Types } from "mongoose";

export interface GetRatingListFilter { 
    product?: Types.ObjectId;
    rating?: number;
    user?: Schema.Types.ObjectId;
}