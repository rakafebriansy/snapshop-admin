import axios from "axios";
import { StoreProductRequest } from "../types/Product";
import { IProduct } from "../models/Product";

class ProductService {
    static async store(data: StoreProductRequest): Promise<IProduct & Document> {
        try {
            const response: IProduct & Document = await axios.post('/api/products', data);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default ProductService;