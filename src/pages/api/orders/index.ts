import type { NextApiRequest, NextApiResponse } from "next";
import { mongooseConnect } from "../../../lib/mongoose";
import logger from "../../../lib/logger";
import { isAdminRequest } from "../auth/[...nextauth]";
import { Order, OrderDoc } from "../../../models/Order";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongooseConnect();
    await isAdminRequest(req, res);

    try {
        if (req.method === "GET") {
            const orders: OrderDoc[] = await Order.find().sort({ createdAt: -1 });
            return res.status(200).json(orders);
        }
        return res.status(405).json({ errors: "Method Not Allowed" });
    } catch (error) {
        logger.error(`/pages/api/orders/index: ${(error as Error)}`);
        return res.status(500).json({ errors: "Internal Server Error", error: (error as Error) });
    }
}
