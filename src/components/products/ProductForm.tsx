import React, { useEffect, useState } from 'react'
import Helper from '../../utils/helper';
import Image from 'next/image';
import { ReactSortable } from 'react-sortablejs';
import { ProductRequestType } from '../../types/Product';
import { CategoryDoc } from '../../models/Category';
import CategoryService from '../../services/category';
import { swalAlert } from '../../lib/swal';
import logger from '../../lib/logger';
import { AxiosError } from 'axios';

export type ProductFormType = {
    product: ProductRequestType,
    callback: Function,
    isEdit: boolean
}

export type ImageUrlSortable = {
    id: number,
    url: string
}

const ProductForm: React.FC<ProductFormType> = ({
    product, callback, isEdit
}: ProductFormType) => {

    const {
        name: existingName,
        slug: existingSlug,
        description: existingDescription,
        price: existingPrice,
        imageUrls: existingImages
    } = product;

    const [name, setName] = useState<string>(existingName || '');
    const [slug, setSlug] = useState<string>(existingSlug || '');
    const [description, setDescription] = useState<string>(existingDescription || '');
    const [price, setPrice] = useState<string>(String(existingPrice || ''));
    const [imageUrls, setImageUrls] = useState<ImageUrlSortable[]>(
        existingImages?.map((url, index) => ({ id: index, url })) || []
    );
    const [images, setImages] = useState<File[]>([]);
    const [categories, setCategories] = useState<CategoryDoc[] | undefined>(undefined);
    const [categoryId, setCategoryId] = useState<string>('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setImages([...images, ...newFiles]);

            newFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageUrls((prevUrls: ImageUrlSortable[]) => [
                        ...prevUrls,
                        { id: prevUrls.length, url: reader.result as string }
                    ]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setImageUrls((prevUrls) => prevUrls.filter((_, index) => index !== indexToRemove));
        setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
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
    }, [])

    return (
        <form className='long-form' onSubmit={(e) => callback(e, {
            _id: product._id,
            name,
            slug,
            description,
            price,
            images,
            categoryId,
            imageUrls: imageUrls.filter((imageUrl) => imageUrl.url.startsWith('/uploads')).map((imageUrl) => imageUrl.url)
        })}>
            <label htmlFor="name">
                <span>Name</span>
                <input
                    type='text'
                    id='name'
                    placeholder='Enter product name...'
                    value={name}
                    onChange={
                        (e) => {
                            const slug = Helper.createSlug(e.target.value);
                            setName(e.target.value);
                            if (!isEdit) {
                                setSlug(slug);
                            }
                        }}
                />
            </label>
            <label htmlFor="slug">
                <span>Slug</span>
                <input
                    readOnly={true}
                    type='text'
                    id='slug'
                    placeholder='-'
                    value={slug}
                />
            </label>
            <label htmlFor="category">
                <span>Category</span>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} id="category">
                    <option value="">Uncategorized</option>
                    {categories && categories.length > 0 && categories.map((category, i) => (
                        <option key={i} value={category._id.toString()}>{category.name}</option>
                    ))}
                </select>
            </label>
            <label htmlFor="description">
                <span>Description</span>
                <textarea
                    id='description'
                    placeholder='Enter product description...'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </label>
            <label htmlFor="price">
                <span>Price (in USD)</span>
                <input
                    id='price'
                    type="text"
                    placeholder='Enter product price...'
                    value={Helper.formatToUSD(price)}
                    onChange={
                        (e) => {
                            setPrice(e.target.value.replace(/,/g, ""));
                        }}
                />
            </label>
            <div className='block'>
                <span>Photo</span>
                <div className="flex h-24 gap-3">
                    {imageUrls && imageUrls?.length > 0 && (
                        <ReactSortable className='flex h-full gap-3' list={imageUrls} setList={setImageUrls} >
                            {
                                imageUrls.map((imageUrl, index) => (
                                    <div className="relative" key={index}>
                                        <svg onClick={() => handleRemoveFile(index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-5 absolute bg-white cursor-pointer hover:bg-gray-100 rounded-full p-1 top-0 right-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                        <Image src={imageUrl.url ?? null} alt={name ?? 'Image Preview'} width={200} height={200} className='w-24 h-full object-contain' />
                                    </div>
                                ))
                            }
                        </ReactSortable>
                    )}
                    <label htmlFor='photo' className='rounded-md select-none cursor-pointer text-gray-500 flex h-full w-24 border border-gray-500/40 text-clip items-center justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                        <span className='text-sm'>Upload</span>
                        <input multiple type="file" onChange={handleImageChange} id="photo" className='hidden' />
                        <span className='block mt-2 text-sm'>{imageUrls && imageUrls?.length < 0 ? 'No photo in this product' : ''}</span>
                    </label>
                </div>
            </div>
            <button className='button-primary mt-5 w-fit' type='submit'>Save</button>
        </form>
    );
}
export default ProductForm;