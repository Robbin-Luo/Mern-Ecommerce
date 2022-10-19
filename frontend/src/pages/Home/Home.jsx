import React, { useRef, useEffect, useState } from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import axios from '../../axios'

import { getHomeProducts } from '../../features/productSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { updateUserCart } from '../../features/userSlice'
import { MdOutlineAddShoppingCart } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'


const Home = () => {
  const navigate = useNavigate();
  const imgContainerRef = useRef();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const products = useSelector((state) => {
    return state.products;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/products')
      .then((res) => {
        dispatch(getHomeProducts(res.data));
      }).catch(
        (err) => console.log(err)
      )
  }, [dispatch])

  useEffect(() => {
    let interval = null;
    let count = 0;
    const timer = setInterval(() => {
      if (!interval) {
        interval = setInterval(() => {
          if (count < 50 && imgContainerRef.current) {
            count = count + 1;
            imgContainerRef.current.style.left = imgContainerRef.current?.style.left.slice(0, -2) * 1 - 2 + 'vw';
          } else {
            count = 0;
            clearInterval(interval);
            interval = null;
          }
        }, 20);
      }
      if (imgContainerRef.current?.style.left.slice(0, -2) <= -700) {
        imgContainerRef.current.style.left = '0';
      }
    }, 6000);
    return (() => {
      clearInterval(timer);
    })
  }, [])

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




  return (

    <div className='main'>
      <div className='sliding-pictures-container' ref={imgContainerRef} >
        <img src="https://www.abctradeoutlet.com.au/uploadfile/upload/2022040110183789.jpg" alt="metal-products" />
        <img src="https://www.abctradeoutlet.com.au/uploadfile/upload/2022011909512565.jpg" alt="team-members" />
        <img src="https://www.abctradeoutlet.com.au/uploadfile/upload/2020060216324476.jpg" alt="delivery" />
        <img src="https://www.abctradeoutlet.com.au/uploadfile/upload/2020060215255263.jpg" alt="plaster-products" />
        <img src="https://www.abctradeoutlet.com.au/uploadfile/upload/2020060216331745.jpg" alt="our-stock" />
        <img src="https://www.abctradeoutlet.com.au/uploadfile/upload/2020042211135947.jpg" alt="delivery-to-site" />
        <img src="https://www.abctradeoutlet.com.au/uploadfile/upload/2020060215492249.jpg" alt="steel-framework-system" />
        <img src="https://www.abctradeoutlet.com.au/uploadfile/upload/2022040110183789.jpg" alt="metal-products" />
      </div>
      <div className='core'>
        <h3>
          ABC Trade Outlet is a leading Australian supplier of building
          products, tools and accessories, with warehouse stores located across
          Sydney and Melbourne, and a fast delivery network servicing
          metropolitan and regional areas.
        </h3>
        <div className='home-product-container'>
          {
            products.map(pro => {
              return <div className='home-product' key={pro.name}>
                <div className='home-product-image-container'>
                  <Link to={`/products/${pro.category}/${pro._id}`}><img src={pro.pictures[0].url} alt={pro.pictures[0].public_id} /></Link>
                </div>
                <Link to={`/products/${pro.category}/${pro._id}`} {...pro}><div>{pro.name}</div></Link>
                <div>{pro.specification}</div>
                <div className='price-cart'><span>${pro.price}</span><span><MdOutlineAddShoppingCart onClick={() => addToCart({ product: pro, quantity: 1 })} /></span></div>
              </div>
            })
          }
          {loading ? <div className='update-cart-options'><LoadingSpinner /></div > : error ? <div className='update-cart-options'>{error}</div> : ''}
        </div>
        <h3>
          We are committed to providing quality and compliant building materials and hardware tools to professional customers in Australia (BUILDERS, SUB-CONTRACTORS, TRADIES). We offer flexible and on time assistance to our customers with rigorous and professional services. Our ambition is to provide compliant products and valuable support to assist our customer in the completion of their projects.
        </h3>
      </div>
      <div className="core">
        <Link to='/products/metal-products' className="category">
          <img src='https://www.groupetango.com/wp-content/uploads/2018/01/IMG_5041-1.jpg' alt='metal products' />
          <div className="category-name">Metal Products</div>
        </Link>
        <Link to='/products/cladding-products' className="category">
          <img src='https://www.architecturalrecord.com/ext/resources/Issues/2021/04-April/New-Cladding-Products-for-Spring-2021.jpg?1617736168' alt='cladding products' />
          <div className="category-name">Cladding Products</div>
        </Link>

        <Link to='/products/plaster-products' className="category">
          <img src='https://www.tradeplaster.com.au/wp-content/uploads/2020/01/Products-4.png' alt='plaster products' />
          <div className="category-name">Plaster Products</div>
        </Link>
        <Link to='/products/insulation-products' className="category">
          <img src='https://pricewiseinsulation.com.au/wp-content/uploads/2019/12/The-Advantages-of-Insulating-Interior-Walls.jpg' alt='insulation products' />
          <div className="category-name">Insulation Products</div>
        </Link>
        <Link to='/products/tiles-products' className="category">
          <img src='https://www.rubi.com/us/blog/wp-content/uploads/2017/05/Types-of-Floor-Tiles-Ceramic-Tiles.jpg' alt='tiles products' />
          <div className="category-name">Tiles</div>
        </Link>
        <Link to='/products/tools-accessories' className="category">
          <img src='https://media.prod.bunnings.com.au/api/public/content/ffe79a94ff334421869dcf3e4fee8751?v=73ad2804&t=w800dpr1' alt='tools & accessories' />
          <div className="category-name">Tools & Accessories</div>
        </Link>
      </div>
    </div>

  )
}

export default Home