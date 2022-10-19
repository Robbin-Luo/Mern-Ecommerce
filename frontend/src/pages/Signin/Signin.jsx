import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Signin.css'
import { useSigninMutation } from '../../services/appApi'
import { useNavigate } from 'react-router-dom'

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signin, { error, isLoading, isError, isSuccess }] = useSigninMutation();

  const handleSignin = (e) => {
    e.preventDefault();
    signin({ email, password });
  }
  isSuccess && navigate('/');
  return (
    <Container>

      <Row>
        <Col md={6} className='signin-image-container signInUp-image-container'></Col>
        <Col md={6} className='signInUp-form-container'>
          <Form style={{ width: '100%' }} onSubmit={handleSignin}>
            <h1>Sign In</h1>
            {isError && <Alert variant='danger'>{error.data}</Alert>}
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' placeholder='Email' autoComplete='off' value={email} required onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' placeholder='Password' value={password} required onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Form.Group className='button-container mb-3'>
              <Button type='submit' disabled={!email || !password || isLoading}>Sign In</Button>
            </Form.Group>
            <p>Don't have an account? <Link to='/signup'>SignUp</Link></p>
          </Form>
        </Col>

      </Row>
    </Container>


  )
}

export default Signin