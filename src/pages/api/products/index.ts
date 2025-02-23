import type { NextApiRequest, NextApiResponse } from "next";
import { ProductDoc, Product } from "../../../models/Product";
import { mongooseConnect } from "../../../lib/mongoose";
import { IncomingForm } from "formidable";
import ServerHelper from "../../../utils/serverHelper";
import logger from "../../../lib/logger";
import { Types } from "mongoose";
import { ProductPropertyRequestType } from "../../../types/Product";

export const config = {
    api: {
        bodyParser: false,
    },
};

export const parseForm = (req: NextApiRequest) => {
    const form = new IncomingForm({ multiples: true });

    return new Promise<{ fields: any; files: any }>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongooseConnect();

    try {
        if (req.method === "GET") {
            const products: ProductDoc[] = await Product.find();
            return res.status(200).json(products);
        } else if (req.method === "POST") {
            const { fields, files } = await parseForm(req);

            const name: string = fields.name?.[0]?.trim() || "";
            const description: string = fields.description?.[0]?.trim() || "";
            const slug: string = fields.slug?.[0]?.trim() || "";
            const price: number = fields.price?.[0] ? parseFloat(fields.price?.[0] as string) : NaN;
            const category: Types.ObjectId | null = fields.categoryId?.[0]? new Types.ObjectId(fields.categoryId?.[0].trim()) : null;
            const properties: ProductPropertyRequestType[] | null = fields.properties?.[0] ? JSON.parse(fields.properties?.[0]) : null;

            console.log(fields);
            console.log(fields.properties);
            if (!name || !description || !slug || isNaN(price) || price <= 0) {
                return res.status(400).json({ errors: "All fields are required." });
            }

            let imageUrls: string[] = [];

            if (files.images) {
                for (const file of files.images) {
                    const filePath: string = await ServerHelper.uploadFile(file, slug);
                    imageUrls.push(filePath);
                }
            }

            const productDoc: ProductDoc = await Product.create({
                name,
                description,
                slug,
                price,
                imageUrls,
                category,
                properties
            });

            return res.status(201).json(productDoc);
        }
        return res.status(405).json({ errors: "Method Not Allowed" });
    } catch (error) {
        logger.error(`/pages/api/products/index: ${(error as Error)}`);
        return res.status(500).json({ errors: "Internal Server Error", error: (error as Error) });
    }
}
