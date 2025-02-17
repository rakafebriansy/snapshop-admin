import { Types } from "mongoose";

export interface ProductRequestType {
    _id?: Types.ObjectId;
    slug: string;
    name: string;
    description: string;
    price: number;
    images?: FileList | null,
    imageUrls?: string[]
}
