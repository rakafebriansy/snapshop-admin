import axios, { AxiosError, AxiosResponse } from "axios";
import logger from "../lib/logger";
import { ProductDoc } from "../models/Product";
import { CategoryRequestType } from "../types/Category";

class CategoryService {
    static async store(data: CategoryRequestType, isServer: boolean = false): Promise<ProductDoc> {
        try {
            const response: AxiosResponse<ProductDoc> = await axios.post(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/categories`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                logger.error(`/services/category/store: ${(error as Error)}`);
            }
            throw error;
        }
    } 
}

export default CategoryService;