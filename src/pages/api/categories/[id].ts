import { NextApiRequest, NextApiResponse } from "next";
import logger from "../../../lib/logger";
import { mongooseConnect } from "../../../lib/mongoose";
import { Category, CategoryDoc } from "../../../models/Category";
import { CategoryRequestType } from "../../../types/Category";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongooseConnect();

    try {
        if (req.method === "PUT") {
            const { id } = req.query;
            const { name, parent }: CategoryRequestType = req.body;

            if (!name) {
                return res.status(400).json({ errors: "Name field are required" });
            }

            const categoryDoc: CategoryDoc | null = await Category.findOneAndUpdate({ _id: id }, {
                name,
                parent: parent ?? null
            }, { new: true });

            return res.status(201).json(categoryDoc);
        }
        return res.status(405).json({ errors: "Method Not Allowed" });
    } catch (error) {
        logger.error(`/pages/api/categories: ${(error as Error)}`);
        return res.status(500).json({ errors: "Internal Server Error", error: (error as Error) });
    }
}
