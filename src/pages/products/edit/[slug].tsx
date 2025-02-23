import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import ProductService from '../../../services/product';
import ProductForm from '../../../components/products/ProductForm';
import { ProductRequestType } from '../../../types/Product';
import logger from '../../../lib/logger';
import { ProductDoc } from '../../../models/Product';
import { swalAlert } from '../../../lib/swal';
import { AxiosError } from 'axios';
import { CategoryDoc } from '../../../models/Category';

const EditProductPage: React.FC = ({ }) => {
    const router = useRouter();
    const { slug } = router.query;
    const [product, setProduct] = useState<ProductRequestType | undefined>(undefined);

    const update = async (e: React.FormEvent<HTMLFormElement>, product: ProductRequestType): Promise<void> => {
        e.preventDefault();
        try {
            if (!((product.images && product.images.length > 1) || (product.imageUrls && product.imageUrls.length > 0))) {
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
            if(product.categoryId) {
                formData.append('categoryId',String(product.categoryId));
                formData.append('properties',(JSON.stringify(product.properties)))
            }

            await ProductService.update(slug as string, formData);
            router.push('/products');
            swalAlert({
                isSuccess: true,
                title: 'Success!',
                text: 'Successfully update product.'
            });
        } catch (error) {
            const message = error instanceof AxiosError ? error.response?.data.errors : (error as Error).message;
            logger.error(`/pages/products/edit@update: ${message}`);
            swalAlert({
                isSuccess: false,
                title: 'Something went wrong!',
                text: `${message}.`
            });
        }
    };

    useEffect(() => {
        if (slug) {
            const getProduct = async () => {
                try {
                    const productDoc: ProductDoc = await ProductService.show(slug as string) as ProductDoc;
                    const productRequest: ProductRequestType = {
                        _id: productDoc._id,
                        slug: productDoc.slug,
                        name: productDoc.name,
                        description: productDoc.description,
                        price: productDoc.price,
                        categoryId: productDoc.category ? String((productDoc.category as CategoryDoc)._id) : undefined,
                        imageUrls: productDoc.imageUrls,
                        properties: productDoc.properties
                    }
                    setProduct(productRequest);
                } catch (error) {
                    const message = error instanceof AxiosError ? error.response?.data.errors : (error as Error).message;
                    logger.error(`/pages/products/edit@get: ${message}`);
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