import { Model, model, models, Schema, Document, Types } from "mongoose";

export interface CategoryDoc extends Document {
    _id: Types.ObjectId;
    name: string;
    parentCategory?: Types.ObjectId;
}

const CategorySchema: Schema = new Schema<CategoryDoc>({
    name: { type: String, required: true },
    parentCategory: { type: Types.ObjectId, required: false },
});

export const Category: Model<CategoryDoc> = models?.Category || model<CategoryDoc>('category', CategorySchema);