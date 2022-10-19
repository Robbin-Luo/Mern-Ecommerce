import React from 'react'
import { Container, Nav, Tab, Col, Row } from 'react-bootstrap'
import './AdminPage.css'
import { useSelector } from 'react-redux'
import ManageOrders from './ManageOrders/ManageOrders'
import EditProduct from './EditProduct/EditProduct'

const AdminPage = () => {
  const user = useSelector(state => state.user);



  return (
    user.isAdmin &&
    <Container className='admin-page-container'>
      <Tab.Container defaultActiveKey='ordersManagement'>
        <Row>
          <Col sm={3}>
            <Nav variant='pills' className='flex-column'>
              <Nav.Item>
                <Nav.Link eventKey='ordersManagement'>Manage Orders</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='editProduct'>Edit A Product</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey='ordersManagement'>
                <ManageOrders />
              </Tab.Pane>
              <Tab.Pane eventKey='editProduct'>
                <EditProduct />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>


  )
}

export default AdminPage