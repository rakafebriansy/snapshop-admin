import { Model, model, models, Schema, Document, Types } from "mongoose";

export interface CategoryDoc extends Document {
    _id: Types.ObjectId;
    name: string;
}

const CategorySchema: Schema = new Schema<CategoryDoc>({
    name: { type: String, required: true },
});

export const Category: Model<CategoryDoc> = models?.Category || model<CategoryDoc>('category', CategorySchema);