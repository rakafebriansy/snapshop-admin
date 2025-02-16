import React, { useState } from 'react'
import Layout from '../../../components/Layout';
import { ProductRequestType, ProductType } from '../../../types/Product';
import ProductService from '../../../services/product';
import { useRouter } from 'next/router';
import ProductForm from '../../../components/products/ProductForm';

const NewProductsPage: React.FC = ({ }) => {

    const { push } = useRouter();
    const product: ProductType = {
        name: '',
        slug: '',
        description: '',
        price: 0,
        imageUrls: []
    };

    const store = async (e: React.FormEvent<HTMLFormElement>, product: ProductRequestType) => {
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
            Array.from(product.images).forEach((file, index) => {
                formData.append(`images`, file);
            });
            
            await ProductService.store(formData);
            push('/products');
        } catch (error) {
            console.log((error as Error).message);
            alert('Error');
        }
    };

    return (
        <Layout>
            <h1>New Product</h1>
            <ProductForm callback={store} product={product} isEdit={false}/>
        </Layout>
    );
}
export default NewProductsPage;