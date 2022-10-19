import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { FcSearch } from 'react-icons/fc';
// import axios from '../../../axios';
import axios from 'axios'
import './EditProduct.css'
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner'

const EditProduct = () => {
  const [searchText, setSearchText] = useState('');
  let trimedText = searchText.trim();
  const [foundProducts, setFoundProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [newPrice, setNewPrice] = useState(0);
  const [newStock, setNewStock] = useState(0);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const handleSearch = async () => {
    setSearchError(null);
    if (trimedText.length < 3) {
      alert('search keyword should be no shorter than 3 letters')
    } else {
      setSearchLoading(true);
      await axios.get(`/products/search?keyword=${trimedText}`)
        .then((res) => {
          setSearchText('');
          setSearchLoading(false);
          if (res.data.length === 0) {
            setSearchError('No product found');
          } else {
            setFoundProducts(res.data);
            setSearchText('');
          }
        })
        .catch((err) => { setSearchError('fail to fetch products, try again later'); setSearchLoading(false) })
    }
  }

  const handleEnter = (e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
      handleSearch();
      return
    }
  }

  const editProduct = (id) => {
    setFoundProducts(foundProducts.filter((product) => product._id === id));
  }

  const updateProduct = async (id) => {
    if (window.confirm(`update price to ${newPrice} and add ${newStock} new stock to the system?`)) {
      setUpdateLoading(true);
      setUpdateError(null);
      axios.post(`/products/${id}`, { newPrice, newStock })
        .then((res) => {
          setFoundProducts(res.data);
          setUpdateLoading(false);
          setNewPrice(0);
          setNewStock(0);
        })
        .catch((err) => {
          setUpdateLoading(false);
          setUpdateError('fail to update, try again later');
        })
    }

  }

  return (
    <div className='edit-product-container'>
      <Form className="d-flex" style={{ paddingLeft: '1rem', paddingRight: '1rem' }} onSubmit={e => e.preventDefault()}>
        <Form.Control
          type="search"
          value={searchText}
          placeholder="Search the product you want to edit"
          className="me-2 search-input"
          aria-label="Search"
          onChange={(e) => setSearchText(e.target.value)}
          onKeyUp={handleEnter}
        />
        <Button variant="outline-success" className='search-btn' onClick={handleSearch}><FcSearch /></Button>
      </Form>
      <div className='found-products-container'>
        {searchLoading ? <div className='search-status'><LoadingSpinner /></div> : searchError ? <div className='search-status'>{searchError}</div> :
          foundProducts.map((foundProduct) => {
            return (
              <>
                <div className='found-product-container' key={foundProduct._id}>
                  <div className='found-product-image-container'>
                    <Link to={`/products/${foundProduct.category}/${foundProduct.name}`} ><img src={foundProduct.pictures[0].url} alt={foundProduct.pictures[0].public_id} /></Link>
                  </div>
                  <div className='found-product-name'><Link to={`/products/${foundProduct.category}/${foundProduct.name}`} >{foundProduct.name}</Link></div>
                  <div className='product-price'>Price: ${foundProduct.price}</div>
                  <div className='product-specification'>{foundProduct.specification}</div>

                  <div className='product-stock'>Stock: {foundProduct.stock}</div>
                  <div className='button-container'><button onClick={() => { editProduct(foundProduct._id) }}>Edit</button></div>
                </div>
                {foundProducts.length === 1 &&
                  <div className='update-form-container'>
                    <div>
                      <div>New Price: <input type='number' min='0.1' value={newPrice} onChange={e => setNewPrice(e.target.value)}></input></div>
                      <div>New Stock: <input type='number' min='-100' max='9999' value={newStock} onChange={e => setNewStock(e.target.value)}></input></div>
                      <button onClick={() => { updateProduct(foundProduct._id) }}>{updateLoading ? <LoadingSpinner /> : 'Update'}</button>
                    </div>

                    {
                      updateError && <Alert variant='danger'>{updateError}</Alert>
                    }
                  </div>
                }
              </>
            )
          })
        }
      </div>
      <div>

      </div>
    </div>
  )
}

export default EditProduct