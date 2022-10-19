import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import './AddNewProduct.css'
import { useAddNewProductMutation } from '../../services/appApi'
import { ImCross } from 'react-icons/im'
import axios from '../../axios'

const AddNewProduct = () => {
  const [name, setName] = useState('');
  const [specification, setSpecification] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState('');
  const [pictures, setPictures] = useState([]);
  const [addNewProduct, { error, isLoading, isError, isSuccess }] = useAddNewProductMutation();

  const handleAddNewProduct = (e) => {
    e.preventDefault();
    if (!name || !description || price === 0 || quantity === 0 || !category || pictures.length === 0) {
      alert('All fields are required for a new product. Price and quantity cannot be 0');
    } else {
      addNewProduct({ name, specification, description, price, quantity, category, pictures });
      setName(''); setSpecification(''); setDescription(''); setPrice(0); setQuantity(0); setPictures([]);
    }
  }
  // if (isSuccess) {
  //   setName(''); setSpecification(''); setDescription(''); setPrice(0); setQuantity(0); setPictures([]);
  // }

  const cloudinary_widget = window.cloudinary.createUploadWidget({
    cloudName: 'dgs2mhdes',
    uploadPreset: 'ABC-Tradeoutlet-images'
  },
    (error, result) => {
      if (!error && result && result.event === 'success') {
        const { url, public_id } = result.info;
        setPictures((prev) => [...prev, { url, public_id }])
      }
    }
  )

  const handleDelete = (public_id) => {
    axios.delete(`/images/${public_id}`)
      .then((res) => {
        setPictures((prev) => prev.filter((pic) => pic.public_id !== public_id));
      })
      .catch(err => console.log(err))
  }

  return (
    <Container className='mb-3'>
      <Row>
        <Col md={6} className='add-new-product-image-container signInUp-image-container'></Col>
        <Col md={6} className='signInUp-form-container' style={{ paddingTop: '80px' }} >
          <Form style={{ width: '100%' }} onSubmit={handleAddNewProduct}>
            <h1>Add A New Product</h1>
            {isError && <Alert variant='danger'>{error.data}</Alert>}
            <Form.Group className='mb-3'>
              <Form.Label className='mb-0'>Product Name</Form.Label>
              <Form.Control type='text' placeholder='Product Name' value={name} required onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className='mb-3 mt-0' onChange={(e) => setSpecification(e.target.value)} required>
              <Form.Label className='mb-0'>Product Specification</Form.Label>
              <Form.Control type='text' placeholder='Product Specification' value={specification} required onChange={(e) => setSpecification(e.target.value)} />
              {/* <Form.Select required defaultValue='none'>
                <option disabled value='none'>--select a specification--</option>
                <option>0.55*51*3000</option><option>0.55*51*3600</option><option>0.55*51*4800</option>
                <option>0.75*51*3000</option><option>0.75*51*3600</option><option>0.75*51*4800</option>
                <option>1.15*51*3000</option><option>1.15*51*3600</option><option>1.15*51*4800</option>
                <option>0.55*64*3000</option><option>0.55*64*3600</option><option>0.55*64*4800</option>
                <option>0.75*64*3000</option><option>0.75*64*3600</option><option>0.75*64*4800</option>
                <option>1.15*64*3000</option><option>1.15*64*3600</option><option>1.15*64*4800</option>
                <option>0.55*76*3000</option><option>0.55*76*3600</option><option>0.55*76*4800</option>
                <option>0.75*76*3000</option><option>0.75*76*3600</option><option>0.75*76*4800</option>
                <option>1.15*76*3000</option><option>1.15*76*3600</option><option>1.15*76*4800</option>
                <option>0.55*92*3000</option><option>0.55*92*3600</option><option>0.55*92*4800</option>
                <option>0.75*92*3000</option><option>0.75*92*3600</option><option>0.75*92*4800</option>
                <option>1.15*92*3000</option><option>1.15*92*3600</option><option> 1.15*92*4800</option>
              </Form.Select> */}
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label className='mb-0'>Product Description</Form.Label>
              <Form.Control as='textarea' className='textarea' placeholder='Product Description' value={description} required onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label className='mb-0'>Product Price</Form.Label>
              <Form.Control type='number' placeholder='Product Price' value={price} required onChange={(e) => setPrice(e.target.value)} />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label className='mb-0'>Quantity</Form.Label>
              <Form.Control type='number' placeholder='Quantity' value={quantity} required onChange={(e) => setQuantity(e.target.value)} />
            </Form.Group>
            <Form.Group className='mb-3 mt-0' onChange={(e) => setCategory(e.target.value)} required>
              <Form.Label className='mb-0'>Product Category</Form.Label>
              <Form.Select required defaultValue='none'>
                <option disabled value='none'>--select a category--</option>
                <option>metal products</option>
                <option>cladding products</option>
                <option>plaster products</option>
                <option>insulation products</option>
                <option>tiles</option>
                <option>tools & accessories</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className='mb-3' style={{ textAlign: 'center' }}>
              <Button className='mb-3 cloudinary-button' type='button' id="upload_widget" onClick={() => cloudinary_widget.open()}>Upload Images</Button>
              <div className='images-preview-container'>
                {pictures.map((picture) => {
                  return <div className='image-preview' key={picture.public_id}>
                    <img src={picture.url} alt={picture.public_id} />
                    <div onClick={() => { handleDelete(picture.public_id) }}><ImCross /></div>
                  </div>
                })}
              </div>
            </Form.Group>
            {isSuccess && <Alert variant='success' style={{ textAlign: 'center !important' }}>{name} added into the system success!</Alert>}
            <Form.Group className='button-container mb-3' >
              <Button type='submit' disabled={isLoading}>Add To System</Button>
            </Form.Group>
          </Form>
        </Col>

      </Row>
    </Container>


  )
}

export default AddNewProduct