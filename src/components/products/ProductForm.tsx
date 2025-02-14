import React, { useState } from 'react'
import Helper from '../../utils/helper';
import { ProductDoc } from '../../models/Product';
import { ProductType } from '../../types/Product';

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
    } = product;

    const [name, setName] = useState(existingName);
    const [slug, setSlug] = useState(existingSlug);
    const [description, setDescription] = useState(existingDescription);
    const [price, setPrice] = useState(String(existingPrice));

    return (
        <form onSubmit={(e) => callback(e, {
            _id: product._id,
            name,
            slug,
            description,
            price
        })}>
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
                            if (!isEdit) {
                                setSlug(slug);
                            }
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
    );
}
export default ProductForm;