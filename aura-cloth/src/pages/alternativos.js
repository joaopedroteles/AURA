import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './Alternativos.css';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../pages/CartContext'; // Importe o contexto do carrinho
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Promo = () => {
  const [banners, setBanners] = useState([]);
  const [alternativo, setAlternativo] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext); // Use o contexto do carrinho

  useEffect(() => {
    const fetchProdutosPorArea = async (area, setState) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/produtos/area/${area}`);
        setState(response.data);
      } catch (error) {
        console.error(`Erro ao buscar produtos da área ${area}:`, error);
      }
    };

    const fetchBanners = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/banners');
        const filtered = res.data.filter((b) => b.location === 'alternativos');
        setBanners(filtered);
      } catch (error) {
        console.error('Erro ao buscar banners:', error);
      }
    };

    fetchBanners();
    fetchProdutosPorArea('alternativo', setAlternativo);
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
      {/* Exibir banners no topo */}
      <Carousel autoPlay interval={3000} infiniteLoop showThumbs={false} showStatus={false}>
        {banners.map((banner) => (
          <div key={banner.id} className="banner-top-item">
            <img
              src={`http://localhost:5000/imagens/${banner.image_path}`}
              alt={banner.nome}
              style={{ width: '100%', marginBottom: '20px' }}
            />
          </div>
        ))}
      </Carousel>
      <h1 className="home-title">Alternativos</h1>
      {renderProdutos(alternativo)}
    </div>
  );
};

export default Promo;