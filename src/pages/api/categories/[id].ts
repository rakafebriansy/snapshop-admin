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
            const { name, parent, properties }: CategoryRequestType = req.body;

            const convertedId: Types.ObjectId = new Types.ObjectId((id as string));

            if (!(convertedId instanceof Types.ObjectId)) return res.status(400).json({ errors: "Invalid ID Format" });

            if (!name) return res.status(400).json({ errors: "Name field are required" });

            const categoryDoc: CategoryDoc | null = await Category.findOneAndUpdate({ _id: convertedId }, {
                name,
                parent: parent ?? null,
                properties: properties ?? null,
            }, { new: true });

            return res.status(201).json(categoryDoc);
        } else if (req.method == 'DELETE') {
            const { id }: CategoryParamsType = req.query;

            const convertedId: Types.ObjectId = new Types.ObjectId((id as string));

            if (!Types.ObjectId.isValid(convertedId)) return res.status(400).json({ errors: "Invalid ID Format" });

            const isParent = await Category.exists({ parent: id });

            if (isParent) return res.status(400).json({ errors: "Category is still used as parent by another category" });

            const result: DeleteResult = await Category.deleteOne({ _id: convertedId });

            if (!result.deletedCount) res.status(404).json({ errors: 'Category is not found' });

            return res.status(200).json(result);
        }
        return res.status(405).json({ errors: "Method Not Allowed" });
    } catch (error) {
        logger.error(`/pages/api/categories/[slug]: ${(error as Error)}`);
        return res.status(500).json({ errors: "Internal Server Error", error: (error as Error) });
    }
}
