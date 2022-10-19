import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer/Footer';
import Signin from './pages/Signin/Signin.jsx';
import Signup from './pages/Signup/Signup.jsx';
import AddNewProduct from './pages/AddNewProduct/AddNewProduct';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home.jsx';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Category from './pages/Category/Category';
import SearchResult from './pages/SearchResult/SearchResult'
import { useState } from 'react'
import Cart from './pages/Cart/Cart';
import OrderPage from './pages/OrderPage/OrderPage';
import AdminPage from './pages/AdminPage/AdminPage';

function App() {
  const [searchParams, setSearchParams] = useState('');

  return (
    <div className="App">
      <BrowserRouter>
        <Navigation setSearchParams={setSearchParams} />
        <div className='main-container'>
          <Routes>
            <Route index element={<Home />} />
            <Route path='*' element={<Home />} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/add-new-product' element={<AddNewProduct />} />
            <Route path='/products/:category/:id' element={<ProductDetails />} />
            <Route path='/products/:category' element={<Category />} />
            <Route path='/products/search' element={<SearchResult searchParams={searchParams} />} />
            <Route path='/:id/cart' element={<Cart />} />
            <Route path='/:id/orders' element={<OrderPage />} />
            <Route path='/dashboard' element={<AdminPage />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
