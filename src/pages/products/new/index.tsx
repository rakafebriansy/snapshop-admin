import React, { useState } from 'react'
import Layout from '../../../components/Layout';
import { AxiosError } from 'axios';
import { StoreProductRequest } from '../../../types/Product';
import ProductService from '../../../services/product';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';
import Helper from '../../../utils/helper';

const NewProductsPage: React.FC = ({ }) => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const { push } = useRouter();

    const store = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const product: StoreProductRequest = {
                name,
                slug,
                description,
                price
            };
            await ProductService.store(product);
            push('/products');
        } catch (error) {
            alert('Error');
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
                        onChange={
                            (e) => {
                                const slug = Helper.createSlug(e.target.value);
                                setName(e.target.value);
                                setSlug(slug);
                            }}
                    />
                </label>
                <label htmlFor="slug">
                    <span>Product slug</span>
                    <input
                        readOnly={true}
                        type='text'
                        name='slug'
                        placeholder='-'
                        value={slug}
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
                        type="text"
                        placeholder='Enter product price...'
                        value={Helper.formatToUSD(price)}
                        onChange={
                            (e) => {
                                setPrice(e.target.value.replace(/,/g, ""));
                            }}
                    />
                </label>
                <button className='button-primary' type='submit'>Save</button>
            </form>
        </Layout>
    );
}
export default NewProductsPage;