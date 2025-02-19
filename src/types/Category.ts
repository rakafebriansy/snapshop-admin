import { Types } from "mongoose";

export type CategoryRequestType = {
    _id?: Types.ObjectId;
    name: string;
    parent?: Types.ObjectId;
    properties?: CategoryPropertyRequestType[]
}

export type CategoryParamsType = {
    id?: Types.ObjectId | Types.ObjectId[];
}

export type CategoryPropertyRequestType = {
    name: string;
    values: string[];
}

export type CategoryPropertyValuesInputType = {
    name: string, 
    values: string
}