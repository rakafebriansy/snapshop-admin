import React from 'react'
import Layout from '../../components/Layout';
import Link from 'next/link';

const ProductsPage: React.FC = ({  }) => {
    return (
        <Layout>
            <Link href='/products/new' className='button-primary'>Add new product</Link>
        </Layout>
    );
}
export default ProductsPage;