import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import ProductService from '../../../services/product';
import ProductForm from '../../../components/products/ProductForm';
import { ProductDoc } from '../../../models/Product';
import { ProductRequestType, ProductType } from '../../../types/Product';

const EditProductPage: React.FC = ({ }) => {
    const router = useRouter();
    const { slug } = router.query;
    const [product, setProduct] = useState<ProductType | undefined>(undefined);

    const update = async (e: React.FormEvent<HTMLFormElement>, product: ProductRequestType) => {
        e.preventDefault();
        try {
            const formData: FormData = new FormData();
            formData.append('name', product.name);
            formData.append('slug', product.slug);
            formData.append('description', product.description);
            formData.append('price', String(product.price));
            if (product.image) {
                formData.append('image', product.image);
            }
            await ProductService.update(slug as string, formData);
            router.push('/products');
        } catch (error) {
            alert('Error');
        }
    };

    useEffect(() => {
        if (slug) {
            const getProduct = async () => {
                try {
                    const product: ProductType = await ProductService.show(slug as string) as ProductType;
                    setProduct(product);
                } catch (error) {
                    alert('Error');
                }
            };

            getProduct();
        }
    }, [slug]);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <h1>Edit Product</h1>
            <ProductForm product={product} callback={update} isEdit={true} />
        </Layout>
    );
}
export default EditProductPage;