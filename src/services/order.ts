import axios, { AxiosError, AxiosResponse } from "axios";
import logger from "../lib/logger";
import { OrderDoc } from "../models/Order";

class OrderService {
    static async index(isServer: boolean = false): Promise<OrderDoc[]> {
        try {
            const response: AxiosResponse<OrderDoc[]> = await axios.get(`${isServer ? process.env.NEXT_PUBLIC_API_URL : ''}/api/orders`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                logger.error(`/services/order@index: ${(error as Error)}`);
            }
            throw error;
        }
    }
}

export default OrderService;