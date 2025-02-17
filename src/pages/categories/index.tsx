import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout';
import CategoryService from '../../services/category';
import { CategoryRequestType } from '../../types/Category';
import logger from '../../lib/logger';
import { swalAlert } from '../../lib/swal';
import { CategoryDoc } from '../../models/Category';
import { AxiosError } from 'axios';

const CategoriesPage: React.FC = ({ }) => {

    const [name, setName] = useState('');
    const [categories, setCategories] = useState<CategoryDoc[] | undefined>(undefined);
    const [parentCategory, setParentCategory] = useState<string>('');

    const store = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const category: CategoryRequestType = {
                name,
                parentCategory
            };
            await CategoryService.store(category);
            setName('');
            swalAlert({
                isSuccess: true,
                title: 'Success!',
                text: 'Successfully add new category.'
            });
            await getCategories();
        } catch (error) {
            console.log(error)
            const message = error instanceof AxiosError ? error.response?.data.errors : (error as Error).message;
            logger.error(`/pages/categories/index@store: ${message}`);
            swalAlert({
                isSuccess: false,
                title: 'Something went wrong!',
                text: `${message}.`
            });
        }
    };

    const getCategories = async (): Promise<void> => {
        const categories: CategoryDoc[] = await CategoryService.index();
        setCategories(categories);
    };

    useEffect(() => {
        try {
            getCategories();
        } catch (error) {
            const message = error instanceof AxiosError ? error.response?.data.errors : (error as Error).message;
            logger.error(`/pages/categories/index@get: ${message}`);
            swalAlert({
                isSuccess: false,
                title: 'Something went wrong!',
                text: `${message}.`
            });
        }
    }, []);

    return (
        <Layout>
            <h1>Categories</h1>
            <label htmlFor="name">
                <span>Name</span>
            </label>
            <form onSubmit={store} className='mb-5'>
                <input
                    type='text'
                    name='name'
                    placeholder='Enter category name...'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <select value={parentCategory} onChange={e => setParentCategory(e.target.value)}>
                    <option>No parent category</option>
                    {categories && categories.length > 0 && categories.map(category => (
                        <option value={category._id.toString()}>{category.name}</option>
                    ))}
                </select>
                <button className='button-primary' type='submit'>Save</button>
            </form>
            <table className='basic max-w-[30rem]'>
                <thead>
                    <tr>
                        <td>Category name</td>
                    </tr>
                </thead>
                <tbody>
                    {categories && categories.length > 0 ? categories.map(category => (
                        <tr className="">
                            <td>{category.name}</td>
                        </tr>
                    )) : (
                        <div className="w-full h-full min-h-32 flex justify-center items-center">
                            <h1>No categories found.</h1>
                        </div>
                    )}
                </tbody>
            </table>
        </Layout>
    );
}
export default CategoriesPage;