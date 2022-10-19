import React, { useEffect, useState } from 'react'
// import axios from '../../axios'
import axios from 'axios'
import { useSelector } from 'react-redux';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { Link } from 'react-router-dom';
import './OrderPage.css'

const OrderPage = () => {
  const user = useSelector(state => state.user);

  const [ordersLoading, setOrdersLoading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [ordersError, setOrdersError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchOrders = async () => {
      setOrdersLoading(true);
      if (user) {
        try {
          const res = await axios.get(`/api/orders/${user._id}`, { signal: abortController.signal });
          setAllOrders(res.data);
          setOrdersLoading(false);
        } catch (err) {
          setOrdersError('failed to load orders');
        }
      }
    };

    fetchOrders();

    // return () => {
    //   abortController.abort();
    // }
  }, [user])


  return (
    <div className='order-page-container'>
      <h5>Your order history</h5>
      {!user ? '' :
        ordersLoading ? <div className='fetch-order-status'><LoadingSpinner /></div> : ordersError ? <div className='fetch-order-status'>{ordersError}</div> : allOrders.length === 0 ? <div className='fetch-order-status'>No order found</div> :
          allOrders.map(order => (
            <div className='order-container' key={order._id}>
              <p>{new Date(order.createdAt).toLocaleDateString()} &nbsp;&nbsp;&nbsp; {new Date(order.createdAt).toLocaleTimeString()}</p>
              {
                order.order.map((item) => (
                  <div className='item-container' key={item._id}>
                    <div className='product-item'>
                      <div className='product-picture'><Link to={`/products/${item.product.category}/${item.product._id}`}><img src={item.product.pictures[0].url} alt={item.product.name} /></Link></div>
                      <div className='product-name'><Link to={`/products/${item.product.category}/${item.product._id}`}>{item.product.name}</Link></div>
                    </div>
                    <div className='product-order-info'>
                      <div className='product-price'>${item.product.price}</div>
                      <div className='product-quantity'>{item.quantity}</div>
                    </div>
                    <div className='order-subtotal'>
                      <div>Subtotal</div>
                      <div className='product-subtotal'>${(item.quantity * item.product.price).toFixed(2)}</div>
                    </div>
                  </div>
                ))
              }
              <div className='order-status'>
                <p>Total: {order.order.reduce((total, current) => total + current.quantity * current.product.price, 0).toFixed(2)}</p>
                {!order.isDelivered ? <div style={{ backgroundColor: 'orange' }}>Processing</div> : <div style={{ backgroundColor: 'green' }}>Delivered</div>}
              </div>

            </div>
          ))
      }
    </div>
  )
}

export default OrderPage