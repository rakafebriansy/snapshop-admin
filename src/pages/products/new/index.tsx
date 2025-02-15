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
        imageUrl: ''
    };

    const store = async (e: React.FormEvent<HTMLFormElement>, product: ProductRequestType) => {
        e.preventDefault();
        try {
            if(!product.image) {
                throw new Error('Image is required.');
            }
            const formData: FormData = new FormData();
            formData.append('name', product.name);
            formData.append('slug', product.slug);
            formData.append('description', product.description);
            formData.append('price', String(product.price));
            formData.append('image', product.image);
            
            await ProductService.store(formData);
            push('/products');
        } catch (error) {
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