import type { NextApiRequest, NextApiResponse } from "next";
import { ProductDoc, Product } from "../../../models/Product";
import { mongooseConnect } from "../../../lib/mongoose";
import { DeleteResult, Types } from "mongoose";
import { IncomingForm } from "formidable";
import logger from "../../../lib/logger";
import ServerHelper from "../../../utils/serverHelper";
import { ProductParamsType, ProductPropertyRequestType } from "../../../types/Product";
import { isAdminRequest } from "../auth/[...nextauth]";

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

        await isAdminRequest(req, res);


        if (method == 'GET') {
            const { slug }: ProductParamsType = req.query;

            if (typeof slug !== 'string') return res.status(400).json({ errors: 'Invalid slug format' });

            const product: ProductDoc | null = await Product.findOne({ slug: slug }).populate('category');

            if (!product) res.status(404).json({ errors: 'Product is not found' });

            return res.status(200).json(product);
        } else if (method == 'PUT') {
            const { slug }: ProductParamsType = req.query;

            if (typeof slug !== 'string') return res.status(400).json({ errors: 'Invalid slug format' });

            const product: ProductDoc | null = await Product.findOne({ slug: slug });
            if (!product) return res.status(404).json({ errors: 'Product not found' });

            const { fields, files } = await parseForm(req);

            const name: string = fields.name?.[0]?.trim() || '';
            const description: string = fields.description?.[0]?.trim() || '';
            const price: number = fields.price?.[0] ? parseFloat(fields.price?.[0] as string) : NaN;
            const existingImages: string = fields.imageUrls?.[0];
            const category: Types.ObjectId | null = fields.categoryId?.[0] ? new Types.ObjectId(fields.categoryId?.[0].trim()) : null;
            const properties: ProductPropertyRequestType | null = fields.properties?.[0] ? JSON.parse(fields.properties?.[0]) : null;

            if (!name || !description || !slug || isNaN(price) || price <= 0) {
                return res.status(400).json({ errors: 'All fields are required.' });
            }

            let imageUrls: string[] = JSON.parse(existingImages || '[]');

            const removedImages: string[] = product.imageUrls.filter((url: string) => !imageUrls.includes(url));
            for (const imageUrl of removedImages) {
                await ServerHelper.deleteFile(imageUrl);
            }

            if (files.images) {
                for (const file of files.images) {
                    const filePath: string = await ServerHelper.uploadFile(file, slug);
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
                        category,
                        properties
                    }
                },
                { new: true }
            );

            if (!productDoc) res.status(404).json({ errors: 'Product is not found' });

            return res.status(200).json(productDoc);
        } else if (method == 'DELETE') {
            const { slug }: ProductParamsType = req.query;

            if (typeof slug !== 'string') return res.status(400).json({ errors: 'Invalid slug format' });

            const result: DeleteResult = await Product.deleteOne({ slug: slug });

            if (!result.deletedCount) res.status(404).json({ errors: 'Product is not found' });

            return res.status(200).json(result);
        }
        return res.status(405).json({ errors: "Method Not Allowed" });
    } catch (error) {
        logger.error(`/pages/api/products/[slug]: ${(error as Error)}`);
        return res.status(500).json({ errors: "Internal Server Error", error: (error as Error) });
    }
}