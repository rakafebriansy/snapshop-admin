import React, { useState } from 'react'
import Layout from '../../components/Layout';
import CategoryService from '../../services/category';
import { CategoryRequestType } from '../../types/Category';
import logger from '../../lib/logger';

const CategoriesPage: React.FC = ({ }) => {

    const [name, setName] = useState('');

    const store = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const category: CategoryRequestType = {
                name
            };
            await CategoryService.store(category);
            setName('');
        } catch (error) {
            logger.error(`/pages/categories/index: ${(error as Error)}`);
            alert('Error');
        }
    };

    return (
        <Layout>
            <h1>Categories</h1>
            <label htmlFor="name">
                <span>Name</span>
            </label>
            <form onSubmit={store}>
                <input
                    type='text'
                    name='name'
                    placeholder='Enter category name...'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <button className='button-primary' type='submit'>Save</button>
            </form>
        </Layout>
    );
}
export default CategoriesPage;