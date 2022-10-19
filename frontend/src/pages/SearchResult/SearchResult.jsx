import React, { useEffect, useState } from 'react'
import { MdOutlineAddShoppingCart } from 'react-icons/md'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { updateUserCart } from '../../features/userSlice'
import { useNavigate } from 'react-router-dom'
// import axios from '../../axios'
import axios from 'axios'
import './SearchResult.css'

const SearchResult = (props) => {
  const { searchParams } = props;
  const [searchProducts, setSearchProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortValue, setSortValue] = useState(0);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();



  useEffect(() => {
    const fetchSearchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/products/search?keyword=${searchParams}`);
        setSearchProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError('fail to get data');
        setLoading(false);
      }
    }

    fetchSearchProducts();
  }, [searchParams])

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === 'low to high') {
      setSortValue(1);
    } else if (value === 'high to low') {
      setSortValue(-1);
    }
  }

  if (searchProducts) {
    searchProducts.sort((a, b) => {
      return (a.price - b.price) * sortValue;
    })
  }

  const addToCart = (item) => {
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
    <div className='category-container'>

      <p>
        <Link to='/products'>all products</Link>&nbsp; &gt;&nbsp;
        Search {searchParams}
      </p>
      <select defaultValue={'none'} onChange={handleChange}>
        <option value='none' disabled>sort by</option>
        <option value='low to high'>price low to high</option>
        <option value='high to low'>price high to low</option>
      </select>

      <div className='category-products-container'>
        {
          loading ? <LoadingSpinner /> : error ? <div>{error}</div> : !searchProducts ? '' : searchProducts.length === 0 ? <div>No product found</div> :
            searchProducts.map((searchProduct) => {
              return <div className='category-product-container' key={searchProduct.name}>
                <div className='category-product-image-container'>
                  <Link to={`/products/${searchProduct.category}/${searchProduct.name}`} ><img src={searchProduct.pictures[0].url} alt={searchProduct.pictures[0].public_id} /></Link>
                </div>
                <div><Link to={`/products/${searchProduct.category}/${searchProduct.name}`} >{searchProduct.name}</Link></div>
                <div>{searchProduct.specification}</div>
                <div><span>${searchProduct.price}</span><span><MdOutlineAddShoppingCart onClick={() => addToCart({ product: searchProduct, quantity: 1 })} /></span></div>
              </div>
            })
        }
      </div>
    </div>
  )
}

export default SearchResult