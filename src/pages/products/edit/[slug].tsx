import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import ProductService from '../../../services/product';
import ProductForm from '../../../components/products/ProductForm';
import { ProductDoc } from '../../../models/Product';
import { ProductType } from '../../../types/Product';

const EditProductPage: React.FC = ({ }) => {
    const router = useRouter();
    const { slug } = router.query;
    const [product, setProduct] = useState<ProductType | undefined>(undefined);

    const update = async (e: React.FormEvent<HTMLFormElement>, product: ProductType) => {
        e.preventDefault();
        try {
            await ProductService.update(product);
            router.push('/products');
        } catch (error) {
            alert('Error');
        }
    };

    useEffect(() => {
        if (slug) {
            const getProducts = async () => {
                try {
                    const product: ProductType = await ProductService.show(slug as string) as ProductType;
                    setProduct(product);
                } catch (error) {
                    alert('Error');
                }
            };

            getProducts();
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