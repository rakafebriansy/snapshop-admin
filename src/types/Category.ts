import { Types } from "mongoose";

export type CategoryRequestType = {
    _id?: Types.ObjectId;
    name: string;
    parentCategory?: Types.ObjectId;
}