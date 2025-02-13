import React, { useState } from 'react'
import Layout from '../../../components/Layout';
import { AxiosError } from 'axios';
import { StoreProductRequest } from '../../../types/Product';
import ProductService from '../../../services/product';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';

const NewProductsPage: React.FC = ({ }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const { push } = useRouter();

    const store = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const product: StoreProductRequest = {
                name,
                description,
                price
            };
            await ProductService.store(product);
            push('/products');
        } catch (error) {
            if (error instanceof AxiosError) {
                alert(error.message);
            }
        }
    };

    return (
        <Layout>
            <form onSubmit={store}>
                <h1>New Product</h1>
                <label htmlFor="name">
                    <span>Product Name</span>
                    <input
                        type='text'
                        name='name'
                        placeholder='Enter product name...'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <label htmlFor="description">
                    <span>Description</span>
                    <textarea
                        placeholder='Enter product description...'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </label>
                <label htmlFor="price">
                    <span>Price (in USD)</span>
                    <input
                        type="number"
                        placeholder='Enter product price...'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </label>
                <button className='button-primary' type='submit'>Save</button>
            </form>
        </Layout>
    );
}
export default NewProductsPage;