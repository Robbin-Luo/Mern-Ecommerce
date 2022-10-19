import React, { useState, useEffect } from 'react'
import axios from '../../../axios';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner'
import { Link } from 'react-router-dom';
import './ManageOrders.css'

const ManageOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setSerror] = useState(null);
  const [undeliveredOrders, setUndeliveredOrders] = useState([]);
  const [changeStatusLoading, setChangeStatusLoading] = useState(false);
  const [changeStatusError, setChangeStatusError] = useState(null);

  useEffect(() => {
    const fetchUndeliveredOrders = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/orders/undelivered-orders');
        setUndeliveredOrders(res.data);
        setIsLoading(false);
      } catch (err) {
        setSerror('fail to fetch data, please try again later');
        setIsLoading(false);
      }
    }

    fetchUndeliveredOrders();
  }, [])

  const changeToDelivered = (id) => {
    if (window.confirm('This order has been delivered?')) {
      setChangeStatusLoading(true);
      axios.patch(`/orders/update-order-status/${id}`)
        .then((res) => { setUndeliveredOrders(res.data); setChangeStatusLoading(false) })
        .catch((err) => { setChangeStatusError('fail to update, please try again later'); setChangeStatusLoading(false) })
    }
  }

  return (
    <div className='manage-orders-container'>
      {
        isLoading ? <div className='fetch-orders-status'><LoadingSpinner /></div> : error ? <div className='fetch-orders-status'>{error}</div> : undeliveredOrders.length === 0 ? <div className='fetch-orders-status'>No undelivered order found</div> :
          undeliveredOrders.map((order) => (
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
                      <div className='product-price'>${item.product.specification}</div>
                      <div className='product-quantity'>quantity: {item.quantity}</div>
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
                {!order.isDelivered ? <><button style={{ backgroundColor: 'orange' }} onClick={() => { changeToDelivered(order._id) }}>{changeStatusLoading ? <LoadingSpinner /> : 'Processing'}</button>{changeStatusError && <p>{changeStatusError}</p>}</> : <button disabled style={{ backgroundColor: 'green' }}>Delivered</button>}
              </div>

            </div>
          ))
      }
    </div>
  )
}

export default ManageOrders


