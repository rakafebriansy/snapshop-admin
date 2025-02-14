import { Types } from "mongoose";

export interface ProductType {
    _id?: Types.ObjectId;
    slug: string;
    name: string;
    description: string;
    price: number;
}
