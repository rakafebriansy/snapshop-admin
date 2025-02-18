import axios, { AxiosError, AxiosResponse } from "axios";
import logger from "../lib/logger";
import { CategoryRequestType } from "../types/Category";
import { CategoryDoc } from "../models/Category";
import { Types } from "mongoose";

class CategoryService {
    static async index(isServer: boolean = false): Promise<CategoryDoc[]> {
        try {
            const response: AxiosResponse<CategoryDoc[]> = await axios.get(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/categories`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                logger.error(`/services/category@index: ${(error as Error)}`);
            }
            throw error;
        }
    }
    static async store(category: CategoryRequestType , isServer: boolean = false): Promise<CategoryDoc> {
        try {
            const response: AxiosResponse<CategoryDoc> = await axios.post(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/categories`, category, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                logger.error(`/services/category@store: ${(error as Error)}`);
            }
            throw error;
        }
    } 
    static async update(category: CategoryRequestType, id: Types.ObjectId, isServer: boolean = false): Promise<CategoryDoc> {
        try {
            const response: AxiosResponse<CategoryDoc> = await axios.put(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/categories/${id}`, category, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                logger.error(`/services/category@update: ${(error as Error)}`);
            }
            throw error;
        }
    } 
    static async delete(id: Types.ObjectId, isServer: boolean = false): Promise<CategoryDoc> {
        try {
            const response: AxiosResponse<CategoryDoc> = await axios.delete(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/categories/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                logger.error(`/services/category@delete: ${(error as Error)}`);
            }
            throw error;
        }
    }
}

export default CategoryService;