import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import ProductService from '../../../services/product';
import logger from '../../../lib/logger';
import { ProductDoc } from '../../../models/Product';
import { swalAlert } from '../../../lib/swal';

const DeleteProductPage: React.FC = ({ }) => {
    const router = useRouter();
    const { slug } = router.query;
    const [product, setProduct] = useState<ProductDoc | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (slug) {
            const getProduct = async () => {
                try {
                    setIsLoading(true);
                    const product: ProductDoc = await ProductService.show(slug as string);
                    setProduct(product);
                } catch (error) {
                    router.back();
                    swalAlert({
                        isSuccess: false,
                        title: 'Something went wrong!',
                        text: `${(error as Error).message}.`
                    });
                } finally {
                    setIsLoading(false);
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
            logger.error(`/pages/products/delete: ${(error as Error)}`);
            swalAlert({
                isSuccess: false,
                title: 'Something went wrong!',
                text: `${(error as Error).message}.`
            });
        }
    };

    if (!isLoading) {
        return <div className='w-full h-full flex justify-center items-center'>
                <h1>Loading...</h1>
            </div>;
    }

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