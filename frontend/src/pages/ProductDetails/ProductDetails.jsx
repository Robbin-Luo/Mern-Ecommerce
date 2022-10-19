import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap'
// import axios from '../../axios'
import axios from 'axios'
import { MdOutlineAddShoppingCart } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { updateUserCart } from '../../features/userSlice'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './ProductDetails.css'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const ProductDetails = () => {
  const { category, id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [bigPictureUrl, setBigPictureUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/products/${category}/${id}`);
        setProduct(response.data.foundProduct);
        setSimilarProducts(response.data.similar);
        setLoading(false);
        setQuantity(0);
      } catch (err) {
        setError('fail to fetch data')
        setLoading(false);
      }
    }
    fetchData();
  }, [category, id]);

  const addToCart = (item) => {
    if (!user) {
      navigate('/signin')
    } else {
      setLoading(true);
      const updateUser = async () => {
        try {
          const res = await axios.post(`/users/${user._id}/update-cart`, item);
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

  const changgeBigPictureUrl = (url) => {
    setBigPictureUrl(url);
  }


  return (
    <div className='product-details'>
      <>
        {
          product &&

          <div className='product-details-core'>
            <div className='product-images'>
              <p>
                <Link to='/products'>all products</Link>&nbsp; &gt;&nbsp;
                <Link to={`/products/${product.category}`}>{product.category}</Link>&nbsp; &gt;&nbsp;
                {product.name}
              </p>
              <div className='big-image-container'>
                <img src={!bigPictureUrl ? product.pictures[0].url : bigPictureUrl} alt={product.pictures[0].public_id} />
              </div>
              <div className='small-images-container'>
                {
                  product.pictures.map((picture) => {
                    return <div className='small-image-container' key={picture.public_id} onClick={() => changgeBigPictureUrl(picture.url)}>
                      <img src={picture.url} alt={picture.public_id} />
                    </div>
                  })
                }
              </div>
            </div>
            <div className='product-details-info'>
              <h2>{product.name}</h2><hr />
              <div>{product.specification}</div><hr />
              <div className='price'>${product.price}</div><hr />
              <div>{product.description}</div><hr />
              <Form onSubmit={e => e.preventDefault()}>
                <Form.Group>
                  <Form.Control type='number' value={quantity} onChange={(e) => setQuantity(e.target.value)} min='0' max='9999' />
                </Form.Group>
                <Form.Group className='mt-3'>
                  <Button onClick={(e) => {
                    e.preventDefault();
                    addToCart({ product: product, quantity })
                  }}>Add To Cart</Button>
                </Form.Group>
              </Form>
              {
                loading ? <div className='add-to-cart-status'> <LoadingSpinner /></div> : error ? <div className='add-to-cart-status'>{error}</div> : ''
              }
            </div>
          </div>
        }
        <h4>You may also want</h4>
        <div className='similar-products-container'>
          {setSimilarProducts.length === 0 ? '' :
            similarProducts.map((similarProduct) => {
              return <div className='similar-product-container' key={similarProduct.name}>
                <div className='similar-product-image-container'>
                  <Link to={`/products/${similarProduct.category}/${similarProduct._id}`} ><img src={similarProduct.pictures[0].url} alt={similarProduct.pictures[0].public_id} /></Link>
                </div>
                <div className='simlilar-product-name'><Link to={`/products/${similarProduct.category}/${similarProduct._id}`} >{similarProduct.name}</Link></div>
                <div>{similarProduct.specification}</div>
                <div><span>${similarProduct.price}</span><span><MdOutlineAddShoppingCart onClick={() => addToCart({ product: similarProduct, quantity: 1 })} /></span></div>
              </div>
            })
          }
        </div>
      </> :
      <></>

    </div>
  )
}

export default ProductDetails