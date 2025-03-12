import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout';
import OrderService from '../../services/order';
import { OrderDoc } from '../../models/Order';

const OrdersPage: React.FC = ({ }) => {

    const [orders, setOrders] = useState<OrderDoc[]>([]);

    useEffect(() => {
        async function getOrders() {
            const orders: OrderDoc[] = await OrderService.index();
            setOrders(orders);
        }
        getOrders();
    }, []);

    return (
        <Layout>
            <h1>Orders</h1>
            <table className='basic'>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Paid</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td className={`font-semibold ${order.paid ? 'text-green-500' : 'text-red-500'}`}>{order.paid ? 'YES' : 'NO'}</td>
                            <td>
                                {order.name} {order.email}<br />
                                {order.streetAddress} {order.city} {order.postalCode}<br />
                                {order.country}<br />
                            </td>
                            <td>{order.line_items.map(item => (
                                <>
                                    {item.price_data.product_data.name} x {item.quantity}<br/>
                                </>
                            ))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}
export default OrdersPage;