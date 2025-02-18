import { Types } from "mongoose";

export type ProductRequestType = {
    _id?: Types.ObjectId;
    slug: string;
    name: string;
    description: string;
    price: number;
    categoryId?: string;
    images?: FileList | null;
    imageUrls?: string[];
}

export type ProductParamsType = {
    slug?: string | string[];
}