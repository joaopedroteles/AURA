import React, { useContext, useEffect, useState  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Importa o arquivo CSS
import axios from 'axios';
import { AuthContext } from '../pages/AuthContext'; // Importe o contexto de autenticação
import { CartContext } from '../pages/CartContext';

const Header = () => {
  const navigate = useNavigate();
  const { authData, logout } = useContext(AuthContext); // Use o contexto de autenticação
  const { cartItems } = useContext(CartContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authData) {
        console.log('authData:', authData); // Log para depuração
        try {
          const response = await axios.get('http://localhost:5000/api/is-admin', {
            headers: { 'user-id': authData.user.id },
          });
          setIsAdmin(response.data.isAdmin);
        } catch (error) {
          console.error('Erro ao verificar status de administrador:', error);
        }
      }
    };
  
    checkAdminStatus();
  }, [authData]);

  const handleLogout = () => {
    setIsAdmin(false);
    logout();
  };

  return (
    <header className="header-container">
      <div className="header-main">
        <Link to="/">
          <img src="/images/logo mini sem fundo.png" alt="Logo" className="header-logo" />
        </Link>
        <nav className="header-nav">
          <ul>
          <li><Link to="/Promos">Promos</Link></li>
            <li><Link to="/Lancamentos">Lançamentos</Link></li>
            <li><Link to="/Geek">Geek</Link></li>
            <li><Link to="/Universidade">Universidades</Link></li>
            <li><Link to="/alternativos">Alternativos</Link></li>
            <li><Link to="/fit">Fit</Link></li>
          </ul>
        </nav>
        <form className="header-search" onSubmit={(e) => {
          e.preventDefault();
          navigate(`/products?search=${e.target.search.value}`);
        }}>
          <input
            type="text"
            name="search"
            placeholder="Buscar produto..."
          />
          <button type="submit">Buscar</button>
        </form>
        <div className="header-icons">
          <Link to="/contato"><i className="fas fa-phone"></i></Link>
          {authData ? (
          <div className="header-profile">
            <i className="fas fa-user"></i>
            <div className="profile-dropdown">
              <Link to="/profile">Meu Perfil</Link>
              {isAdmin && (
                <Link to="/admin">Página do Admin</Link>
              )}
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Registrar</Link>
            </>
          )}
                  <Link to="/cart"><i className="fas fa-shopping-cart"></i></Link>
        <Link to="/cart" style={{ position: 'relative' }}>
                {/* Mostra a quantidade de itens */}
        {cartItems.length > 0 && (
          <span 
            style={{
              position: 'absolute',
              top: '-5px',
              right: '4px',
              backgroundColor: 'red',
              color: 'white',
              padding: '2px 5px',
              borderRadius: '50%',
              fontSize: '0.8rem'
            }}
          >
            {cartItems.length}
          </span>
        )}
      </Link>        </div>
      </div>
    </header>
  );
};

export default Header;