import axios, { AxiosError, AxiosResponse } from "axios";
import { ProductDoc } from "../models/Product";


class ProductService {
    static async index(isServer: boolean = false): Promise<ProductDoc[]> {
        try {
            const response: AxiosResponse<ProductDoc[]> = await axios.get(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/products`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
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
            if (error instanceof AxiosError) {
                console.error(error.message);
            }
            throw error;
        }
    }

    static async store(data: FormData, isServer: boolean = false): Promise<ProductDoc> {
        try {
            const response: AxiosResponse<ProductDoc> = await axios.post(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/products`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async update(slug: string, data: FormData, isServer: boolean = false): Promise<ProductDoc> {
        try {
            const response: AxiosResponse<ProductDoc> = await axios.put(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/products/${slug}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async delete(slug: string, isServer: boolean = false): Promise<ProductDoc> {
        try {
            const response: AxiosResponse<ProductDoc> = await axios.delete(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/products/${slug}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default ProductService;