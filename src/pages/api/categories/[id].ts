import { NextApiRequest, NextApiResponse } from "next";
import logger from "../../../lib/logger";
import { mongooseConnect } from "../../../lib/mongoose";
import { Category, CategoryDoc } from "../../../models/Category";
import { CategoryParamsType, CategoryRequestType } from "../../../types/Category";
import { DeleteResult, Types } from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongooseConnect();

    try {
        if (req.method === "PUT") {
            const { id }: CategoryParamsType = req.query;
            const { name, parent }: CategoryRequestType = req.body;

            if (!(id instanceof Types.ObjectId)) return res.status(400).json({ errors: "Invalid ID Format" });

            if (!name) return res.status(400).json({ errors: "Name field are required" });

            const categoryDoc: CategoryDoc | null = await Category.findOneAndUpdate({ _id: id }, {
                name,
                parent: parent ?? null
            }, { new: true });

            return res.status(201).json(categoryDoc);
        } else if (req.method == 'DELETE') {
            const { id }: CategoryParamsType = req.query;
            console.log(id instanceof Types.ObjectId)

            if (!Types.ObjectId.isValid(id as Types.ObjectId)) {
                return res.status(400).json({ errors: "Invalid ID Format" });
            }
        
            const result: DeleteResult = await Category.deleteOne({ _id: id });

            if (!result) res.status(404).json({ errors: 'Product is not found' });

            return res.status(200).json(result);
        }
        return res.status(405).json({ errors: "Method Not Allowed" });
    } catch (error) {
        logger.error(`/pages/api/categories: ${(error as Error)}`);
        return res.status(500).json({ errors: "Internal Server Error", error: (error as Error) });
    }
}
