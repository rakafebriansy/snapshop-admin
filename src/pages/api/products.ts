import type { NextApiRequest, NextApiResponse } from "next";
import { IProduct, Product } from "../../models/Product";
import { mongooseConnect } from "../../lib/mongoose";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { method } = req;
    await mongooseConnect();

    if (method == 'POST') {
        const { name, description, price } = req.body;
        const productDoc: IProduct & Document = await Product.create({
            name,
            description,
            price
        });
        res.status(200).json(productDoc);

    }
    res.status(200).json({
        id: '',
        name: '',
        description: '',
        price: '',
    });
}
