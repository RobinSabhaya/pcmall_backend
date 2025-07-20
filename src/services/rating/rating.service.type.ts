import { Schema } from "mongoose";

export interface GetRatingListFilter { 
    product?: Schema.Types.ObjectId;
    rating?: number;
    user?: Schema.Types.ObjectId;
}