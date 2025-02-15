import type { NextApiRequest, NextApiResponse } from "next";
import { ProductDoc, Product } from "../../../models/Product";
import { mongooseConnect } from "../../../lib/mongoose";
import { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
    api: { bodyParser: false },
};

const parseForm = (req: NextApiRequest) => {
    const form = new IncomingForm({ multiples: false });

    return new Promise<{ fields: any; files: any }>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongooseConnect();

    if (req.method === "GET") {
        const products: ProductDoc[] = await Product.find();
        return res.status(200).json(products);
    }

    if (req.method === "POST") {
        try {
            const { fields, files } = await parseForm(req);

            const name = fields.name?.[0]?.trim() || "";
            const description = fields.description?.[0]?.trim() || "";
            const slug = fields.slug?.[0]?.trim() || "";
            const price = fields.price?.[0] ? parseFloat(fields.price?.[0] as string) : NaN;

            if (!name || !description || !slug || isNaN(price) || price <= 0) {
                return res.status(400).json({ message: "All fields are required." });
            }

            let filePath = "";


            if (files.image) {
                const file = files.image[0];
                const fileData = fs.readFileSync(file.filepath);
                filePath = `/uploads/${file.originalFilename}`;
                fs.writeFileSync(`./public${filePath}`, fileData);
            }

            const productDoc: ProductDoc = await Product.create({
                name,
                description,
                slug,
                price,
                imageUrl: filePath,
            });

            return res.status(201).json('productDoc');
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }

    return res.status(405).json({ message: "Method Not Allowed" });
}
