import React, { useEffect, useState } from 'react'
import { MdOutlineAddShoppingCart } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { updateUserCart } from '../../features/userSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// import axios from '../../axios'
import axios from 'axios'
import './Category.css'

const Category = () => {
  const [categoryProducts, setCategoryProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { category } = useParams();
  const [sortValue, setSortValue] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  let fixedCategory;
  if (category === 'tools-accessories') {
    fixedCategory = 'tools & accessories'
  } else {
    fixedCategory = category.split('-').join(' ');
  }

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/products/${fixedCategory}`);
        setCategoryProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError('fail to get data');
        setLoading(false);
      }
    }

    fetchCategoryProducts();
  }, [fixedCategory])

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === 'low to high') {
      setSortValue(1);
    } else if (value === 'high to low') {
      setSortValue(-1);
    }
  }

  if (categoryProducts) {
    categoryProducts.sort((a, b) => {
      return (a.price - b.price) * sortValue;
    })
  }

  const addToCart = (item) => {
    if (!user) {
      navigate('/signin');
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
    <div className='category-container'>

      <p>
        <Link to='/products'>all products</Link>&nbsp; &gt;&nbsp;
        {fixedCategory}
      </p>
      <select defaultValue={'none'} onChange={handleChange}>
        <option value='none' disabled>sort by</option>
        <option value='low to high'>price low to high</option>
        <option value='high to low'>price high to low</option>
      </select>

      <div className='category-products-container'>
        {
          loading ? <LoadingSpinner /> : error ? <div>{error}</div> : !categoryProducts ? '' : categoryProducts.length === 0 ? <div>No product found in this category</div> :
            categoryProducts.map((categoryProduct) => {
              return <div className='category-product-container' key={categoryProduct.name}>
                <div className='category-product-image-container'>
                  <Link to={`/products/${categoryProduct.category}/${categoryProduct._id}`} ><img src={categoryProduct.pictures[0].url} alt={categoryProduct.pictures[0].public_id} /></Link>
                </div>
                <div><Link to={`/products/${categoryProduct.category}/${categoryProduct._id}`} >{categoryProduct.name}</Link></div>
                <div>{categoryProduct.specification}</div>
                <div><span>${categoryProduct.price}</span><span><MdOutlineAddShoppingCart onClick={() => addToCart({ product: categoryProduct, quantity: 1 })} /></span></div>
              </div>
            })
        }
      </div>
    </div>
  )
}

export default Category