import axios, { AxiosError, AxiosResponse } from "axios";
import { ProductType } from "../types/Product";
import { ProductDoc } from "../models/Product";

class ProductService {
    static async index(isServer: boolean = false): Promise<ProductDoc[]> {
        try {
            const response: AxiosResponse<ProductDoc[]> = await axios.get(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/products`);
            return response.data;
        } catch (error) {
            if(error instanceof AxiosError) {
                console.error(error.message);
            }
            throw error;
        }
    }

    static async show(slug: string, isServer: boolean = false): Promise<ProductDoc> {
        try {
            const response: AxiosResponse<ProductDoc> = await axios.get(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/products/${slug}`);
            return response.data;
        } catch (error) {
            if(error instanceof AxiosError) {
                console.error(error.message);
            }
            throw error;
        }
    }

    static async store(data: ProductType, isServer: boolean = false): Promise<ProductDoc> {
        try {
            const response: AxiosResponse<ProductDoc> = await axios.post(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/products`, data);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async update(data: ProductType, isServer: boolean = false): Promise<ProductDoc> {
        try {
            console.log(data);
            if(data._id == null) {
                throw new Error('_id is required.');
            }
            const response: AxiosResponse<ProductDoc> = await axios.put(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/products/${data.slug}`, data);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default ProductService;