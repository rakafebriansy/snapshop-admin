import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import ProductService from '../../../services/product';
import logger from '../../../lib/logger';
import { ProductDoc } from '../../../models/Product';
import { swalAlert } from '../../../lib/swal';
import { AxiosError } from 'axios';

const DeleteProductPage: React.FC = ({ }) => {
    const router = useRouter();
    const { slug } = router.query;
    const [product, setProduct] = useState<ProductDoc | undefined>(undefined);

    useEffect(() => {
        if (slug) {
            const getProduct = async () => {
                try {
                    const product: ProductDoc = await ProductService.show(slug as string);
                    setProduct(product);
                } catch (error) {
                    router.back();
                    const message = error instanceof AxiosError ? error.response?.data.errors : (error as Error).message;
                    logger.error(`/pages/products/delete@get: ${message}`);
                    swalAlert({
                        isSuccess: false,
                        title: 'Something went wrong!',
                        text: `${message}.`
                    });
                }
            };

            getProduct();
        }
    }, [slug]);

    const remove = async (): Promise<void> => {
        try {
            if (!product) {
                throw new Error('Product is required');
            }
            await ProductService.delete(product.slug);
            router.push('/products');
            swalAlert({
                isSuccess: true,
                title: 'Success!',
                text: 'Successfully delete product.'
            });
        } catch (error) {
            const message = error instanceof AxiosError ? error.response?.data.errors : (error as Error).message;
            logger.error(`/pages/products/delete@remove: ${message}`);
            swalAlert({
                isSuccess: false,
                title: 'Something went wrong!',
                text: `${message}.`
            });
        }
    };

    return (
        <Layout>
            <p>Do you really want to delete product {product?.name}?</p>
            <div className="flex gap-3 mt-3">
                <button className='button-light' onClick={() => router.back()}>No</button>
                <button className='button-danger' onClick={remove}>Yes</button>
            </div>
        </Layout>
    );
}
export default DeleteProductPage;