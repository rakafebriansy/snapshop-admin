import React, { useState } from 'react'
import Helper from '../../utils/helper';
import { ProductType } from '../../types/Product';
import Image from 'next/image';

export type ProductFormType = {
    product: ProductType,
    callback: Function,
    isEdit: boolean
}

const ProductForm: React.FC<ProductFormType> = ({
    product, callback, isEdit
}: ProductFormType) => {

    const {
        name: existingName,
        slug: existingSlug,
        description: existingDescription,
        price: existingPrice,
        imageUrl: existingImage
    } = product;

    const [name, setName] = useState(existingName);
    const [slug, setSlug] = useState(existingSlug);
    const [description, setDescription] = useState(existingDescription);
    const [price, setPrice] = useState(String(existingPrice));
    const [imageUrl, setImageUrl] = useState(existingImage);
    const [image, setImage] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if(file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            }
            reader.readAsDataURL(file);
        }
    }

    return (
        <form onSubmit={(e) => callback(e, {
            _id: product._id,
            name,
            slug,
            description,
            price,
            image
        })}>
            <label htmlFor="name">
                <span>Name</span>
                <input
                    type='text'
                    name='name'
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
            <div className='block'>
                <span>Photo</span>
                <label htmlFor='photo' className='rounded-md select-none cursor-pointer text-gray-500 flex w-24 h-24 border border-gray-500/40 text-clip items-center justify-center'>
                    {image ? (
                        <Image src={imageUrl ?? null} alt={name ?? 'Image Preview'} width={200} height={200} className='w-full h-full object-contain'/>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className='text-sm'>Upload</span>
                        </>
                    )}
                    <input type="file" onChange={handleImageChange} id="photo" className='hidden' />
                </label>
                <span className='block mt-2 text-sm'>{image ? image.name : 'No photo in this product'}</span>
            </div>
            <button className='button-primary mt-5' type='submit'>Save</button>
        </form>
    );
}
export default ProductForm;