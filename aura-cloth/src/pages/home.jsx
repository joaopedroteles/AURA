import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importa o CSS do carrossel
import './Home.css'; // Importa o arquivo CSS
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../pages/CartContext'; // Importe o contexto do carrinho
import { AuthContext } from '../pages/AuthContext'; // Importe o contexto de autenticação

const Home = () => {
  const [lancamentos, setLancamentos] = useState([]);
  const [promos, setPromos] = useState([]);
  const [geek, setGeek] = useState([]);
  const [bannersHome, setBannersHome] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const { addToCart, cartItems } = useContext(CartContext); // Use o contexto do carrinho
  const { authData, logout } = useContext(AuthContext); // Use o contexto de autenticação
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      const filtered = res.data.filter((p) => p.location === 'home');
      setPosts(filtered);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    }
  };

  fetchPosts();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authData) {
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

  useEffect(() => {
    const fetchBannersHome = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/banners?location=home');
        setBannersHome(response.data);
      } catch (error) {
        console.error('Erro ao buscar banners da Home:', error);
      }
    };

    fetchBannersHome();
  }, []);

  useEffect(() => {
    const fetchProdutosPorArea = async (area, setState) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/produtos/area/${area}`);
        setState(response.data);
      } catch (error) {
        console.error(`Erro ao buscar produtos da área ${area}:`, error);
      }
    };

    fetchProdutosPorArea('Lancamentos', setLancamentos);
    fetchProdutosPorArea('Promo', setPromos);
    fetchProdutosPorArea('geek', setGeek);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const cabeca = document.querySelector('.home-cabeca');
      const banner = document.querySelector('.banner-container');
      if (cabeca && banner) {
        const bannerBottom = banner.getBoundingClientRect().bottom;
        if (bannerBottom <= 0) {
          cabeca.classList.add('scrolled');
        } else {
          cabeca.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const cabeca = document.querySelector('.home-cabeca');
      const banner = document.querySelector('.banner-container');
      if (cabeca && banner) {
        const bannerBottom = banner.getBoundingClientRect().bottom;
        if (bannerBottom <= 0) {
          cabeca.classList.add('scrolled');
        } else {
          cabeca.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleBuyNow = (id) => {
    navigate(`/produtos/${id}`);
  };

  const handleAddToCart = (produto) => {
    addToCart(produto);
    console.log(`Produto ${produto.nome} adicionado ao carrinho`);
  };

  const renderProdutos = (produtos) => (
    <div className="product-grid">
      {produtos.map((produto) => (
        <div className="product-card" key={produto.id}>
          <img
            src={`http://localhost:5000/imagens/${produto.image_path}`}
            alt={produto.nome}
            className="product-image"
          />
          <h2 className="product-name">{produto.nome}</h2>
          <p className="product-price">{produto.preco ? `R$ ${produto.preco}` : 'Preço não disponível'}</p>
          <button className="product-button" onClick={() => handleBuyNow(produto.id)}>Comprar</button>
          <button className="product-button" onClick={() => handleAddToCart(produto)}>Adicionar ao Carrinho</button>
        </div>
      ))}
    </div>
  );

  return (

    <div className="home-container">
      <header className="home-cabeca">
        <div className="header-principal">
          <Link to="/">
            <img src="/images/logo mini sem fundo.png" alt="Logo" className="header-logoblk" />
          </Link>
          <nav className={`header-navegacao ${menuOpen ? 'open' : ''}`}>
            <ul>
              <li><Link to="/Promos">Promos</Link></li>
              <li><Link to="/Lancamentos">Lançamentos</Link></li>
              <li><Link to="/Geek">Geek</Link></li>
              <li><Link to="/Universidade">Universidades</Link></li>
              <li><Link to="/alternativos">Alternativos</Link></li>
              <li><Link to="/fit">Fit</Link></li>
            </ul>
          </nav>
          <form className="header-pesquisa" onSubmit={(e) => {
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
          <div className="header-icones">
            {authData ? (
              <div className="header-perfil">
                <i className="fas fa-user"></i>
                <div className="profile-abre">
                <Link to="/profile">Meu Perfil</Link>
                {isAdmin && (
                <Link to="/admin">Página do Admin</Link>
              )}
                  <button onClick={handleLogout}>Logout</button>
                </div>
                <Link to="/contato"><i className="fas fa-phone"></i></Link>
              </div>
              
            ) : (
              <Link to="/login"><i className="fas fa-user"></i></Link>
            )}
            <Link to="/cart" className="cart-icon">
              <i className="fas fa-shopping-cart"></i>
              {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
            </Link>
          </div>
          <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            <i className="fas fa-bars"></i>
          </div>
        </div>
      </header>

      <div className="banner-container">
      <Carousel autoPlay interval={3000} infiniteLoop showThumbs={false} showStatus={false}>
  {bannersHome.map((banner) => (
    <div key={banner.id} className="banner-top-item">
      <img
        src={`http://localhost:5000/imagens/${banner.image_path}`}
        alt={banner.nome}
        style={{ width: '100%', marginBottom: '20px' }}
      />
    </div>
  ))}
</Carousel>
</div>


      <h1 className="home-title">Lançamentos</h1>
      {renderProdutos(lancamentos)}
      <div  className="posts-grid">
      <h1>Posts Home</h1>
      <div className="posts-container">
        {posts.map((post) => (
          <div key={post.id} className="post-item">
            <img
              src={`http://localhost:5000/imagens/${post.image_path}`}
              alt={post.nome}
            />
          </div>
          ))}
                </div>
                </div>
      <h1 className="home-title">Promoções</h1>
      {renderProdutos(promos)}
      <h1 className="home-title">Geek</h1>
      {renderProdutos(geek)}
    </div>
  );
};

export default Home;