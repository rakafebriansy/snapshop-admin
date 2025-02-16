import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import { ProductType } from '../../../types/Product';
import ProductService from '../../../services/product';
import logger from '../../../lib/logger';

const DeleteProductPage: React.FC = ({ }) => {
    const router = useRouter();
    const { slug } = router.query;
    const [product, setProduct] = useState<ProductType | undefined>(undefined);

    useEffect(() => {
        if (slug) {
            const getProduct = async () => {
                try {
                    const product: ProductType = await ProductService.show(slug as string) as ProductType;
                    setProduct(product);
                } catch (error) {
                    alert('Error');
                }
            };

            getProduct();
        }
    }, [slug]);

    const remove = async () => {
        try {
            if (!product) {
                throw new Error('Product is required');
            }
            await ProductService.delete(product.slug);
            router.push('/products');
        } catch (error) {
            logger.error(`/pages/products/delete: ${(error as Error)}`);
            alert('Error');
        }
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <p>Do you really want to delete product {product.name}?</p>
            <div className="flex gap-3 mt-3">
                <button className='button-light' onClick={() => router.back()}>No</button>
                <button className='button-danger' onClick={remove}>Yes</button>
            </div>
        </Layout>
    );
}
export default DeleteProductPage;