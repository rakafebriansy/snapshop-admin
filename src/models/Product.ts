import { Model, model, models, Schema } from "mongoose";

export interface IProduct extends Document {
    _id: string;
    name: string;
    description: string;
    price: number;
}

const ProductSchema: Schema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }
});

export const Product: Model<IProduct> = models.Product || model<IProduct>('product', ProductSchema);