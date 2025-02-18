import { Model, model, models, Schema, Document, Types } from "mongoose";
import { CategoryDoc } from "./Category";

export interface ProductDoc extends Document {
    _id: Types.ObjectId;
    slug: string;
    name: string;
    description: string;
    price: number;
    imageUrls: string[];
    category?: CategoryDoc
}

const ProductSchema: Schema = new Schema<ProductDoc>({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrls: [{ type: String, required: true }],
    category: { type: Types.ObjectId, ref: 'Category', required: false },
});

export const Product: Model<ProductDoc> = models?.Product || model<ProductDoc>('Product', ProductSchema);