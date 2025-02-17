import { Types } from "mongoose";

export interface CategoryRequestType {
    _id?: Types.ObjectId;
    name: string;
    parentCategory?: string;
}