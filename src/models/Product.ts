import { Model, model, models, Schema, Document, Types } from "mongoose";

export interface ProductDoc extends Document {
    _id: Types.ObjectId;
    slug: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string
}

const ProductSchema: Schema = new Schema<ProductDoc>({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true }
});

export const Product: Model<ProductDoc> = models.Product || model<ProductDoc>('product', ProductSchema);