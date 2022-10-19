import React, { useState, useRef } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Signup.css'
import { useSignupMutation } from '../../services/appApi'
import { ImCross } from 'react-icons/im'
import isEmail from 'validator/es/lib/isEmail'
import { useNavigate } from 'react-router-dom'



const Signup = () => {
  const confirmPwdRef = useRef();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [mobile, setMobile] = useState('');
  const [signup, { error, isLoading, isError, isSuccess }] = useSignupMutation();

  const validPassword = /[a-z]/.test(password) && /[A-z]/.test(password) && /\d/.test(password) && /[~!@#$%&*]/.test(password) && password.length >= 8 && password.length <= 24;
  const validConfirmPassword = confirmPwd === password;
  const validEmail = isEmail(email);
  const validMobile = /04\d{8}/.test(mobile);

  const handleSignup = (e) => {
    e.preventDefault();
    signup({ email, mobile, password });
  }

  isSuccess && navigate('/');

  return (
    <Container>
      <Row>
        <Col md={6} className='signup-image-container signInUp-image-container'></Col>
        <Col md={6} className='signInUp-form-container'>
          <Form style={{ width: '100%' }} onSubmit={handleSignup}>
            <h1>Sign Up</h1>
            {isError && <Alert variant='danger'>{error.data}</Alert>}
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' placeholder='Email' autoComplete='off' value={email} required onChange={(e) => setEmail(e.target.value)} />
              <p className='alert' style={validEmail || !email ? { display: 'none' } : { display: 'block' }}><ImCross /> Invalid email address</p>
            </Form.Group>
            <Form.Group>
              <Form.Label>Mobile</Form.Label>
              <Form.Control type='text' placeholder='Mobile' value={mobile} required onChange={(e) => setMobile(e.target.value)} />
              <p className='alert' style={validMobile || !mobile ? { display: 'none' } : { display: 'block' }}><ImCross /> Mobile numbers should start 04 with a length of 10</p>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' placeholder='Password' value={password} required onChange={(e) => setPassword(e.target.value)} />
              <p className='alert' style={validPassword || !password ? { display: 'none' } : { display: 'block' }}><ImCross /> Password should contain at least one lowercase letter, one uppercase letter, one number , one special character, with length between 8 and 24. Allowed special character: ~, !, @, #, $, %, &amp;, *</p>
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type='password' placeholder='Confirm Password' ref={confirmPwdRef} value={confirmPwd} required onChange={(e) => setConfirmPwd(e.target.value)} />
              <p className='alert' style={!validConfirmPassword && confirmPwdRef.current === document.activeElement ? { display: 'block' } : { display: 'none' }}><ImCross />Passwords should match</p>
            </Form.Group>
            <Form.Group className='button-container mb-3' >
              <Button type='submit' disabled={!validConfirmPassword || !validEmail || !validMobile || !validPassword || isLoading}>Sign In</Button>
            </Form.Group>
            <p>Already have an account? <Link to='/signin'>SignIn</Link></p>
          </Form>
        </Col>

      </Row>
    </Container>


  )
}

export default Signup