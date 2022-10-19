import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import { MdDelete } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { updateUserCart } from '../../features/userSlice'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import './Cart.css'
import { Link } from 'react-router-dom'
// import axios from '../../axios'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '../../components/CheckoutForm/CheckoutForm'

const Cart = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentIntentLoading, setPaymentIntentLoading] = useState(false);
  const [paymentIntentError, setPaymentIntentError] = useState(null);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  let totalAmount = 0;
  if (user) {
    totalAmount = user.cart.reduce((total, curr) => {
      return total + curr.quantity * curr.product.price;
    }, 0);
  }

  // stripe section starts here
  const stripePromise = loadStripe('pk_test_51LaBroADhroeGlaDJTS2v3dtDXzXiWgcnKHrePHLMcXEMzYz6tCWD4aDgW5KKx3LlbCwSR2EUjwdXJ5KlEZ75ui600SVpabAqc')
  const [clientSecret, setClientSecret] = useState('');
  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  useEffect(() => {
    const abortController = new AbortController();

    const createPaymentIntent = async () => {
      setPaymentIntentLoading(true);

      if (totalAmount > 0) {
        try {
          const res = await axios.post('/api/create-payment-intent', { totalAmount: totalAmount.toFixed(2) }, { signal: abortController.signal });
          setClientSecret(res.data.clientSecret);
          setPaymentIntentLoading(false);
        } catch (err) {
          setPaymentIntentError('fail to load payment, please refresh the page to try again');
          setPaymentIntentLoading(false);
        }
      }

    }

    createPaymentIntent();


    // return () => {
    //   console.log(abortController)
    //   abortController.abort();
    // }


  }, [totalAmount])

  // stripe section ends here

  const handleDelete = (item) => {
    if (!user) return;
    if (window.confirm('Do you want to delete this item?')) {
      setLoading(true);
      const updateUser = async () => {
        try {
          const res = await axios.post(`/api/users/${user._id}/delete-cart`, item);
          dispatch(updateUserCart(res.data));
          setLoading(false);
        } catch (err) {
          setError('fail to add to cart');
          setLoading(false);
          let timer = setInterval(() => {
            setError('');
            clearInterval(timer);
          }, 5000)
        }
      }

      updateUser();
    }

  }

  const handleChangeQuantity = (item) => {
    if (!user) {
      navigate('/signin')
    } else {
      setLoading(true);
      const updateUser = async () => {
        try {
          const res = await axios.post(`/api/users/${user._id}/update-cart`, item);
          dispatch(updateUserCart(res.data));
          setLoading(false);
        } catch (err) {
          setError('fail to add to cart');
          setLoading(false);
          let timer = setInterval(() => {
            setError('');
            clearInterval(timer);
          }, 5000)
        }
      }

      updateUser();
    }

  }

  return (
    <Container className='cart-page'>
      <Row>
        <Col md={6} className='cart-container'>
          <h2>Your Cart</h2>
          <div className='order-container'>
            {!user || user.cart.length === 0 ? <div className='empty-cart'>Your cart is empty. Go to <Link to='/'>shopping</Link>. Or check your <Link to={`/${user._id}/orders`}>order history</Link> </div> :
              user.cart.map((item) =>
                <div key={item.product._id} className='order-single'>
                  {loading ? <div className='update-status'><LoadingSpinner /></div> : error ? <div className='update-status'>{error}</div> : ''}

                  <div className='product-item'>
                    <div className='product-picture'><Link to={`/products/${item.product.category}/${item.product._id}`}><img src={item.product.pictures[0].url} alt={item.product.name} /></Link></div>
                    <div className='product-name'><Link to={`/products/${item.product.category}/${item.product._id}`}>{item.product.name}</Link></div>
                  </div>
                  <div className='product-order-info'>
                    <div className='product-price'>${item.product.price}</div>
                    <div className='product-quantity'><input type='number' defaultValue={item.quantity} min='1' max='9999' onBlur={(e) => handleChangeQuantity({ product: item.product, quantity: e.target.value * 1 - item.quantity * 1 })} /></div>
                  </div>
                  <div className='order-subtotal'>
                    <div>Subtotal</div>
                    <div className='product-subtotal'>${(item.quantity * item.product.price).toFixed(2)}</div>
                  </div>
                  <div onClick={() => handleDelete({ product: item.product })}><MdDelete /></div>
                  {
                    item.product.stock <= 0 && <Alert variant='danger'>This product is out of stock. Please contact us on<a href='tel:0438657369'>0438657369</a> to confirm.</Alert>
                  }
                </div>
              )
            }
          </div>
          {
            user.cart.length > 0 &&
            <div className='order-total-amount'>
              <div>Total:</div>
              <div>${totalAmount.toFixed(2)}</div>
            </div>
          }
        </Col>
        <Col md={6} className='stripe-container'>
          {
            clientSecret && user.cart.length > 0 && (
              <Elements options={options} stripe={stripePromise} key={clientSecret}>
                <CheckoutForm totalAmount={totalAmount} user={user} paymentIntentError={paymentIntentError} paymentIntentLoading={paymentIntentLoading} />
              </Elements>
            )
          }
        </Col>
      </Row>
    </Container>
  )
}

export default Cart