import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import ProductService from '../../services/product';
import { ProductDoc } from '../../models/Product';
import logger from '../../lib/logger';
import { AxiosError } from 'axios';


const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<ProductDoc[]>([]);
    
    useEffect(() => {
        const getProducts = async () => {
            const products: ProductDoc[] = await ProductService.index();
            setProducts(products);
        }
        try {
            getProducts();
        } catch (error) {
            const message = error instanceof AxiosError ? error.response?.data.errors : (error as Error).message;
            logger.error(`/pages/products/index@get: ${message}`);
        }
    }, []);
    return (
        <Layout>
            <Link href="/products/new" className="button-primary">
                &#43; Add new product
            </Link>

            {products.length === 0 ? (
                <div className="w-full h-full flex justify-center items-center">
                    <h1>No products found.</h1>
                </div>
            ) : (
                <table className="basic mt-2 max-w-[50rem]">
                    <thead>
                        <tr className="text-sm font-semibold">
                            <td>NAME</td>
                            <td>ACTION</td>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, i) => (
                            <tr key={i}>
                                <td>{product.name}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <Link className="button-info" href={`/products/edit/${product.slug}`}>
                                            Edit
                                        </Link>
                                        <Link className="button-danger" href={`/products/delete/${product.slug}`}>
                                            Delete
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Layout>
    );
};

export default ProductsPage;
