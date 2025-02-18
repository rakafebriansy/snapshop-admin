import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout';
import CategoryService from '../../services/category';
import { CategoryRequestType } from '../../types/Category';
import logger from '../../lib/logger';
import { swalAlert } from '../../lib/swal';
import { CategoryDoc } from '../../models/Category';
import { AxiosError } from 'axios';
import { Types } from 'mongoose';

const CategoriesPage: React.FC = ({ }) => {

    const [editCategory, setEditCategory] = useState<CategoryRequestType | undefined>(undefined);
    const [name, setName] = useState('');
    const [categories, setCategories] = useState<CategoryDoc[] | undefined>(undefined);
    const [parent, setParent] = useState<string>('');

    const send = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const category: CategoryRequestType = {
                name,
            };

            if (editCategory && editCategory._id) {
                category.parent = parent ? new Types.ObjectId(parent) : undefined;
                await update(category, editCategory._id);
            } else {
                category.parent = parent ? new Types.ObjectId(parent) : undefined;
                await store(category);
            }

            setName('');
            setParent('');
            await getCategories();
        } catch (error) {
            const message = error instanceof AxiosError ? error.response?.data.errors : (error as Error).message;
            logger.error(`/pages/categories/index@send: ${message}`);
            swalAlert({
                isSuccess: false,
                title: 'Something went wrong!',
                text: `${message}.`
            });
        }
    };

    const store = async (category: CategoryRequestType) => {
        try {
            await CategoryService.store(category);
            swalAlert({
                isSuccess: true,
                title: 'Success!',
                text: 'Successfully add new category.'
            });
        } catch (error) {
            const message = error instanceof AxiosError ? error.response?.data.errors : (error as Error).message;
            logger.error(`/pages/categories/index@store: ${message}`);
            throw error;
        }
    }

    const update = async (category: CategoryRequestType, editCategoryId: Types.ObjectId) => {
        try {
            await CategoryService.update(category, editCategoryId);
            swalAlert({
                isSuccess: true,
                title: 'Success!',
                text: 'Successfully update category.'
            });
        } catch (error) {
            const message = error instanceof AxiosError ? error.response?.data.errors : (error as Error).message;
            logger.error(`/pages/categories/index@update: ${message}`);
            throw error;
        }
    }

    const edit = (category?: CategoryDoc) => {
        if (category) {
            const newCategory: CategoryRequestType = {
                _id: category._id,
                name: category.name,
                parent: category.parent ? category.parent._id : undefined
            };
            setEditCategory(newCategory);
            setName(category.name);
            setParent(category.parent ? String(category.parent._id) : '');
        } else {
            setEditCategory(undefined);
            setName('');
            setParent('');
        }
    }

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
                {editCategory ? (
                    <div className='flex gap-2'>
                        <span>Edit category {editCategory.name}</span>
                        <span className='text-xs  text-blue-500 hover:underline cursor-pointer' onClick={() => edit()}>Create new category</span>
                    </div>
                ) : (
                    <span>Create new category</span>
                )}
            </label>
            <form onSubmit={send} className='mb-5'>
                <input
                    type='text'
                    name='name'
                    placeholder='Enter category name...'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <select value={parent} onChange={e => setParent(e.target.value)}>
                    <option value=''>No parent category</option>
                    {categories && categories.length > 0 && categories.map(category => (
                        <option value={category._id.toString()}>{category.name}</option>
                    ))}
                </select>
                <button className='button-primary' type='submit'>Save</button>
            </form>
            <table className='basic max-w-[40rem]'>
                <thead>
                    <tr className='text-sm font-semibold uppercase'>
                        <td>Name</td>
                        <td>Parent Category</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {categories && categories.length > 0 ? categories.map(category => (
                        <tr className="">
                            <td>{category.name}</td>
                            <td>{category.parent ? String(category.parent.name) : (<span className='text-gray-300'>-</span>)}</td>
                            <td>
                                <div className="flex justify-center gap-2">
                                    <button className='button-info' onClick={() => edit(category)}>
                                        <svg className='w-4 h-4' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button className='button-danger'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className='w-4 h-4'>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={3}>
                                <div className="w-full h-full flex justify-center items-center">
                                    No categories found.
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Layout>
    );
}
export default CategoriesPage;