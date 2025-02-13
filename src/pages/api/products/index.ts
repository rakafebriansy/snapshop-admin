import type { NextApiRequest, NextApiResponse } from "next";
import { ProductDoc, Product } from "../../../models/Product";
import { mongooseConnect } from "../../../lib/mongoose";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { method } = req;
    await mongooseConnect();

    if (method == 'GET') {
            const products: ProductDoc[] = await Product.find();
            res.status(200).json(products);
    } else if (method == 'POST') {
        const { name, description, price, slug } = req.body;
        const productDoc: ProductDoc = await Product.create({
            name,
            description,
            slug,
            price
        });
        res.status(201).json(productDoc);
    }
    res.status(500).json({
        message: 'Internal Server Error'
    });
}
