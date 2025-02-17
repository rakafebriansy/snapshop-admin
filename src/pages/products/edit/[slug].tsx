import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import ProductService from '../../../services/product';
import ProductForm from '../../../components/products/ProductForm';
import { ProductRequestType } from '../../../types/Product';
import logger from '../../../lib/logger';
import { ProductDoc } from '../../../models/Product';
import { swalAlert } from '../../../lib/swal';

const EditProductPage: React.FC = ({ }) => {
    const router = useRouter();
    const { slug } = router.query;
    const [product, setProduct] = useState<ProductDoc | undefined>(undefined);

    const update = async (e: React.FormEvent<HTMLFormElement>, product: ProductRequestType): Promise<void> => {
        e.preventDefault();
        try {
            if (!((product.images && product.images.length > 1) || (product.imageUrls && product.imageUrls.length > 1))) {
                throw new Error('At least one image is required.');
            }

            const formData: FormData = new FormData();
            formData.append('name', product.name);
            formData.append('slug', product.slug);
            formData.append('description', product.description);
            formData.append('price', String(product.price));

            if (product.images) {
                Array.from(product.images).forEach((file, index) => {
                    formData.append(`images`, file);
                });
            }
            if (product.imageUrls) {
                formData.append('imageUrls', JSON.stringify(product.imageUrls));
            }

            await ProductService.update(slug as string, formData);
            router.push('/products');
            swalAlert({
                isSuccess: true,
                title: 'Success!',
                text: 'Successfully update product.'
            });
        } catch (error) {
            logger.error(`/pages/products/edit: ${(error as Error)}`);
            swalAlert({
                isSuccess: false,
                title: 'Something went wrong!',
                text: `${(error as Error).message}.`
            });
        }
    };

    useEffect(() => {
        if (slug) {
            const getProduct = async () => {
                try {
                    const product: ProductDoc = await ProductService.show(slug as string) as ProductDoc;
                    setProduct(product);
                } catch (error) {
                    swalAlert({
                        isSuccess: false,
                        title: 'Something went wrong!',
                        text: `${(error as Error).message}.`
                    });
                }
            };

            getProduct();
        }
    }, [slug]);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <h1>Edit Product</h1>
            <ProductForm product={product} callback={update} isEdit={true} />
        </Layout>
    );
}
export default EditProductPage;