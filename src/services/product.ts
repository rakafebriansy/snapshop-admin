import axios, { AxiosResponse } from "axios";
import { StoreProductRequest } from "../types/Product";
import { IProduct } from "../models/Product";

class ProductService {
    static async store(data: StoreProductRequest, isServer: boolean = false): Promise<IProduct & Document> {
        try {
            const response: AxiosResponse<IProduct & Document> = await axios.post(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/products`, data);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    static async index(isServer: boolean = false): Promise<(IProduct & Document)[]> {
        try {
            const response: AxiosResponse<(IProduct & Document)[]> = await axios.get(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/products`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default ProductService;