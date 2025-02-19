import { Model, model, models, Schema, Document, Types } from "mongoose";
import { CategoryPropertyRequestType } from "../types/Category";

export interface CategoryDoc extends Document {
    _id: Types.ObjectId;
    name: string;
    parent?: {
        _id: Types.ObjectId,
        name: string
    };
    properties?: CategoryPropertyRequestType[];
}

const CategorySchema: Schema = new Schema<CategoryDoc>({
    name: { type: String, required: true },
    parent: { type: Types.ObjectId, ref: 'Category', required: false },
    properties: [{ type: Object, required: false }]
});

export const Category: Model<CategoryDoc> = models?.Category || model<CategoryDoc>('Category', CategorySchema);