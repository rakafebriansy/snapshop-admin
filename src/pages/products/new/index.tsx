import React, { useState } from 'react'
import Layout from '../../../components/Layout';
import { ProductRequestType } from '../../../types/Product';
import ProductService from '../../../services/product';
import { useRouter } from 'next/router';
import ProductForm from '../../../components/products/ProductForm';
import logger from '../../../lib/logger';
import { swalAlert } from '../../../lib/swal';
import { AxiosError } from 'axios';

const NewProductsPage: React.FC = ({ }) => {

    const { push } = useRouter();
    const product: ProductRequestType = {
        name: '',
        slug: '',
        description: '',
        price: 0,
    };

    const store = async (e: React.FormEvent<HTMLFormElement>, product: ProductRequestType): Promise<void> => {
        e.preventDefault();
        try {
            if (!product.images || product.images.length === 0) {
                throw new Error('At least one image is required.');
            }

            const formData: FormData = new FormData();
            formData.append('name', product.name);
            formData.append('slug', product.slug);
            formData.append('description', product.description);
            formData.append('price', String(product.price));
            Array.from(product.images).forEach((file) => {
                formData.append(`images`, file);
            });
            if(product.categoryId) {
                formData.append('categoryId',(product.categoryId))
            }

            await ProductService.store(formData);
            push('/products');
            swalAlert({
                isSuccess: true,
                title: 'Success!',
                text: 'Successfully add new product.'
            });
        } catch (error) {
            const message = error instanceof AxiosError ? error.response?.data.errors : (error as Error).message;
            logger.error(`/pages/products/new@store: ${message}`);
            swalAlert({
                isSuccess: false,
                title: 'Something went wrong!',
                text: `${message}.`
            });
        }
    };

    return (
        <Layout>
            <h1>New Product</h1>
            <ProductForm callback={store} product={product} isEdit={false} />
        </Layout>
    );
}
export default NewProductsPage;