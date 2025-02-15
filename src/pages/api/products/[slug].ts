import type { NextApiRequest, NextApiResponse } from "next";
import { ProductDoc, Product } from "../../../models/Product";
import { mongooseConnect } from "../../../lib/mongoose";
import { DeleteResult } from "mongoose";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { method } = req;
    await mongooseConnect();

    if (method == 'GET') {
        const { slug } = req.query;

        if (typeof slug !== 'string') {
            res.status(400).json({
                message: 'Invalid slug format'
            });
        }

        const product: ProductDoc | null = await Product.findOne({ slug: slug });

        if (!product) {
            res.status(404).json({
                message: 'Product is not found'
            });
        }

        return res.status(200).json(product);
    } else if (method == 'PUT') {
        const { slug } = req.query;

        if (typeof slug !== 'string') {
            res.status(400).json({
                message: 'Invalid slug format'
            });
        }

        const { name, description, price } = req.body;

        if (!name || !description || price === undefined) {
            return res.status(400).json({
                message: 'Missing required fields: name, description, price'
            });
        }

        const product: ProductDoc | null = await Product.findOneAndUpdate(
            { slug: slug },
            { $set: { name, description, price } },
            { new: true }
        );

        if (!product) {
            res.status(404).json({
                message: 'Product is not found'
            });
        }

        return res.status(200).json(product);
    } else if (method == 'DELETE') {
        const { slug } = req.query;

        if (typeof slug !== 'string') {
            res.status(400).json({
                message: 'Invalid slug format'
            });
        }

        const product: DeleteResult = await Product.deleteOne({ slug: slug });

        if (!product) {
            res.status(404).json({
                message: 'Product is not found'
            });
        }

        return res.status(200).json(product);
    }
    return res.status(500).json({
        message: 'Internal Server Error'
    });
}
