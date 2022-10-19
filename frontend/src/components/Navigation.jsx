import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import './Navigation.css'
import { Button } from 'react-bootstrap';
import { logout } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap'
import { FcSearch } from 'react-icons/fc'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { Link } from 'react-router-dom'



const Navigation = (props) => {
  const navigate = useNavigate();
  const { setSearchParams } = props;
  const [searchText, setSearchText] = useState('')
  let trimedText = searchText.trim();

  const user = useSelector((state) => {
    return state.user;
  });
  const dispatch = useDispatch();

  const handleSignout = () => {
    dispatch(logout());
    navigate('/signin');
  }

  const handleSearch = () => {
    if (trimedText.length < 3) {
      alert('search keyword should be no shorter than 3 letters')
    } else {

      setSearchParams(trimedText);
      navigate(`/products/search?keyword=${trimedText}`);
      setSearchText('');
    }
  }

  const handleEnter = (e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
      handleSearch();
      return
    }
  }

  return (
    <Navbar bg="light" expand="lg" id='navbar'>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand >
            <img src="https://www.abctradeoutlet.com.au/uploadfile/upload/2020042210535626.png" alt="ABC-Trade-Outlet-Logo" />
          </Navbar.Brand>
        </LinkContainer>
        <Form className="d-flex" style={{ paddingLeft: '1rem', paddingRight: '1rem' }} onSubmit={e => e.preventDefault()}>
          <Form.Control
            type="search"
            value={searchText}
            placeholder="Search"
            className="me-2 search-input"
            aria-label="Search"
            onChange={(e) => setSearchText(e.target.value)}
            onKeyUp={handleEnter}
          />
          <Button variant="outline-success" className='search-btn' onClick={handleSearch}><FcSearch /></Button>
        </Form>
        <Link to={user ? `/${user._id}/cart` : '/signin'} className='cart'><AiOutlineShoppingCart /><div>{user ? user.cart.length : 0}</div></Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" id='navbar-btn' />
        <Navbar.Collapse id="basic-navbar-nav" >
          <Nav className="ms-auto">
            <NavDropdown title="Product Range" id="basic-nav-dropdown">
              <LinkContainer to="/products/metal-products">
                <NavDropdown.Item >Metal Products</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/products/cladding-products">
                <NavDropdown.Item >Cladding Products</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/products/plaster-products">
                <NavDropdown.Item >Plaster Products</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/products/insulation-products">
                <NavDropdown.Item >Insulation Products</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/products/tiles">
                <NavDropdown.Item >Tiles</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/products/tools-accessories">
                <NavDropdown.Item >tools & accessories</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
            {!user ?
              <>
                <LinkContainer to="/signin">
                  <Nav.Link >Sign In</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/signup">
                  <Nav.Link >Sign Up</Nav.Link>
                </LinkContainer>
              </> :
              <>
                <NavDropdown title={user.email} id="basic-nav-dropdown">
                  {user.isAdmin &&
                    <>
                      <LinkContainer to="/dashboard">
                        <NavDropdown.Item >Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/add-new-product">
                        <NavDropdown.Item >Add A New Product</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  }

                  {!user.isAdmin &&
                    <>
                      <LinkContainer to={`/${user._id}/cart`}>
                        <NavDropdown.Item >My Cart</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to={user ? `/${user._id}/orders` : '/signin'}>
                        <NavDropdown.Item >My Orders</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                    </>
                  }
                  <Button className='signout-btn' variant='danger' onClick={handleSignout} >SignOut</Button>
                </NavDropdown>
              </>
            }


          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default Navigation