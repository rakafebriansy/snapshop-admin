import { NextApiRequest, NextApiResponse } from "next";
import logger from "../../../lib/logger";
import { mongooseConnect } from "../../../lib/mongoose";
import { Category, CategoryDoc } from "../../../models/Category";
import { CategoryRequestType } from "../../../types/Category";
import { isAdminRequest } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongooseConnect();

    await isAdminRequest(req, res);

    try {
        if (req.method === 'GET') {
            const categories: CategoryDoc[] = await Category.find().populate('parent');
            return res.status(200).json(categories);
        } else if (req.method === "POST") {
            const { name, parent, properties }: CategoryRequestType = req.body;

            if (!name) {
                return res.status(400).json({ errors: "Name field are required" });
            }

            const categoryDoc: CategoryDoc = await Category.create({
                name,
                parent,
                properties
            });

            return res.status(201).json(categoryDoc);
        }
        return res.status(405).json({ errors: "Method Not Allowed" });
    } catch (error) {
        logger.error(`/pages/api/categories/index: ${(error as Error)}`);
        return res.status(500).json({ errors: "Internal Server Error", error: (error as Error) });
    }
}
