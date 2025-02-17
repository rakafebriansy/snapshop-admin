import { NextApiRequest, NextApiResponse } from "next";
import logger from "../../../lib/logger";
import { mongooseConnect } from "../../../lib/mongoose";
import { Category, CategoryDoc } from "../../../models/Category";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongooseConnect();

    try {
        if (req.method === 'GET') {
            const categories: CategoryDoc[] = await Category.find();
            return res.status(200).json(categories);
        } else if (req.method === "POST") {
            const { name } = req.body;

            const categoryDoc: CategoryDoc = await Category.create({
                name,
            });

            return res.status(201).json(categoryDoc);
        }
        return res.status(405).json({ message: "Method Not Allowed" });
    } catch (error) {
        logger.error(`/pages/api/categories: ${(error as Error)}`);
        return res.status(500).json({ message: "Internal Server Error", error: (error as Error) });
    }
}
