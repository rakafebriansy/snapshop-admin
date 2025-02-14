import React, { useState } from 'react'
import Layout from '../../../components/Layout';
import { AxiosError } from 'axios';
import { ProductType } from '../../../types/Product';
import ProductService from '../../../services/product';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';
import Helper from '../../../utils/helper';
import ProductForm from '../../../components/products/ProductForm';
import { ProductDoc } from '../../../models/Product';

const NewProductsPage: React.FC = ({ }) => {

    const { push } = useRouter();
    const product: ProductType = {
        name: '',
        slug: '',
        description: '',
        price: 0,
    };

    const store = async (e: React.FormEvent<HTMLFormElement>, product: ProductType) => {
        e.preventDefault();
        try {
            await ProductService.store(product);
            push('/products');
        } catch (error) {
            alert('Error');
        }
    };

    return (
        <Layout>
            <ProductForm callback={store} product={product} isEdit={false}/>
        </Layout>
    );
}
export default NewProductsPage;