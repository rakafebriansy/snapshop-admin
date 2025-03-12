import { Model, model, models, Schema, Document, Types } from "mongoose";

export interface OrderDoc extends Document {
    _id: Types.ObjectId;
    line_items: Object[];
    name: String;
    email: String;
    city: String;
    postalCode: String;
    streetAddress: String;
    country: String;
    paid: Boolean;
}

const OrderSchema: Schema = new Schema<OrderDoc>({
    line_items: [{ type: Object, required: true }],
    name: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    streetAddress: { type: String, required: true },
    country: { type: String, required: true },
    paid: { type: Boolean, required: true },
},{
    timestamps: true
});

export const Order: Model<OrderDoc> = models?.Order || model<OrderDoc>('Order', OrderSchema);