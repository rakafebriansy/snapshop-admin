import type { NextApiRequest, NextApiResponse } from "next";
import { ProductDoc, Product } from "../../../models/Product";
import { mongooseConnect } from "../../../lib/mongoose";
import { DeleteResult } from "mongoose";
import fs from "fs";
import { IncomingForm } from "formidable";
import logger from "../../../lib/logger";
import ServerHelper from "../../../utils/serverHelper";

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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {

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

            if (typeof slug !== 'string') return res.status(400).json({ message: 'Invalid slug format' });

            const product = await Product.findOne({ slug: slug });
            if (!product) return res.status(404).json({ message: 'Product not found' });

            const { fields, files } = await parseForm(req);

            const name = fields.name?.[0]?.trim() || '';
            const description = fields.description?.[0]?.trim() || '';
            const price = fields.price?.[0] ? parseFloat(fields.price?.[0] as string) : NaN;
            const existingImages = fields.imageUrls?.[0];

            if (!name || !description || !slug || isNaN(price) || price <= 0) {
                return res.status(400).json({ message: 'All fields are required.' });
            }

            let imageUrls = JSON.parse(existingImages || '[]');

            const removedImages = product.imageUrls.filter((url: string) => !imageUrls.includes(url));
            for (const imageUrl of removedImages) {
                await ServerHelper.deleteFile(imageUrl);
            }

            if (files.images) {
                for (const file of files.images) {
                    const filePath = await ServerHelper.uploadFile(file, slug);
                    imageUrls.push(filePath);
                }
            }

            const productDoc: ProductDoc | null = await Product.findOneAndUpdate(
                { slug: slug },
                {
                    $set: {
                        name,
                        description,
                        slug,
                        price,
                        imageUrls,
                    }
                },
                { new: true }
            );

            if (!productDoc) {
                res.status(404).json({
                    message: 'Product is not found'
                });
            }

            return res.status(200).json(productDoc);
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
        return res.status(405).json({ message: "Method Not Allowed" });
    } catch (error) {
        logger.error(`/pages/api/products/[slug]: ${(error as Error)}`);
        return res.status(500).json({ message: "Internal Server Error", error: (error as Error) });
    }
}