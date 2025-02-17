import React from 'react'
import Layout from '../../components/Layout';
import Link from 'next/link';
import ProductService from '../../services/product';
import { ProductDoc } from '../../models/Product';
import { swalAlert } from '../../lib/swal';

export async function getServerSideProps() {
    try {
        const data: ProductDoc[] = await ProductService.index(true);
        return {
            props: {
                products: data
            }
        }
    } catch (error) {
        swalAlert({
            isSuccess: false,
            title: 'Something went wrong!',
            text: `${(error as Error).message}.`
        });
    }
}

export type ProductsPageProps = {
    products: (ProductDoc & Document)[]
}

const ProductsPage: React.FC<ProductsPageProps> = ({ products }: ProductsPageProps) => {

    return (
        <Layout>
            <Link href='/products/new' className='button-primary'>&#43; Add new product</Link>

            {products.length < 1 ? (
                <div className="w-full h-full flex justify-center items-center">
                    <h1>No products found.</h1>
                </div>
            ) : (
                <table className='basic mt-2'>
                    <thead>
                        <tr>
                            <td>Product name</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, i) => (
                            <tr key={i}>
                                <td>{product.name}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <Link className='button-info' href={`/products/edit/${product.slug}`}>
                                            <svg className='w-4 h-4' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                            Edit
                                        </Link>
                                        <Link className='button-danger' href={`/products/delete/${product.slug}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className='w-4 h-4'>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                            Delete
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Layout>
    );
}
export default ProductsPage;