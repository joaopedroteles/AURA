import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/home';
import Products from './pages/products';
import ProductDetail from './pages/ProductDetail'; // Importe o componente ProductDetail
import Profile from './pages/Profile'; // Importe o componente Profile
import Header from './pages/header';
import Footer from './pages/Footer';
import Cart from './pages/Cart';
import { CartProvider } from './pages/CartContext';
import { AuthProvider } from './pages/AuthContext'; // Importe o AuthProvider
import Checkout from './pages/Checkout';
import AddProduct from './pages/AddProduct'; // Importe o componente AddProduct
import Promo from './pages/Promo';
import Lancamentos from './pages/Lancamentos';
import Geek from './pages/Geek';
import Universidade from './pages/Universidade';
import Admin from './pages/Admin';
import Fit from './pages/Fit'; // Importa a página Fit
import AdminProdutos from './pages/AdminProdutos';
import Alternativos from './pages/alternativos';
import AdminOrderDetails from './pages/AdminOrderDetails';

const AppContent = () => {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/register', '/'];
  const hideFooterRoutes = ['/login', 'register'];

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header /> }
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/produtos/:id" element={<ProductDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} /> {/* Adicione a rota de perfil */}
        <Route path="/admin/add-product" element={<AddProduct />} /> {/* Adicione a rota de adicionar produto */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/Geek" element={<Geek />} />
        <Route path="/Lancamentos" element={<Lancamentos />} />
        <Route path="/Promos" element={<Promo />} />
        <Route path="/Fit" element={<Fit />} /> {/* Adiciona a rota para a página Fit */}
        <Route path="/Universidade" element={<Universidade />} />
        <Route path="/alternativos" element={<Alternativos />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
        <Route path="/admin-produtos" element={<AdminProdutos />} />
      </Routes>/
      {!hideFooterRoutes.includes(location.pathname) && <Footer /> }
    </>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  </Router>
);

export default App;