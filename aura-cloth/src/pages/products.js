import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './Products.css'; // Importa o arquivo CSS
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../pages/CartContext'; // Importe o contexto do carrinho
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importa o CSS do carrossel

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [area, setArea] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useContext(CartContext); // Use o contexto do carrinho
  const [ banners, setBanners] = useState([]);


  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/banners');
        const filtered = res.data.filter((b) => b.location === 'produtos');
        setBanners(filtered);
      } catch (error) {
        console.error('Erro ao buscar banners:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const searchQuery = searchParams.get('search') || '';
        const areaQuery = searchParams.get('area') || '';
        const response = await axios.get(`http://localhost:5000/api/produtos?search=${searchQuery}&area=${areaQuery}`);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Erro na busca de produtos:', error);
      }
    };

    fetchBanners();
    fetchProducts();
  }, [location.search, setBanners]);

  useEffect(() => {
    let filtered = products;
    if (area) {
      filtered = products.filter(product => product.area === area);
    }
    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.preco - b.preco);
    } else {
      filtered.sort((a, b) => b.preco - a.preco);
    }
    setFilteredProducts(filtered);
  }, [area, sortOrder, products]);

  const handleBuyNow = (id) => {
    navigate(`/produtos/${id}`);
  };

  const handleAddToCart = (produto) => {
    addToCart(produto);
    console.log(`Produto ${produto.nome} adicionado ao carrinho`);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="produtos-container">
      
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

    <div className="products-container">
      <h1 className="products-title">Produtos</h1>
      <div className="filters">
        <select value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">Todas as Áreas</option>
          <option value="Lancamentos">Lançamentos</option>
          <option value="Promo">Promoções</option>
          <option value="geek">Geek</option>
          <option value="fit">Fit</option>
          <option value="best">Best</option>
          <option value="university">Faculdades</option>
        </select>
        <button onClick={handleSortOrderToggle}>
          Ordenar por preço: {sortOrder === 'asc' ? '>' : '<'}
        </button>
      </div>
      <div className="products-grid">
        {filteredProducts.map((produto) => (
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
    </div>
  </div>
  );
};

export default Products;