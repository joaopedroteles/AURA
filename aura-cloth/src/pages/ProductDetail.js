import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css'; // Importa o arquivo CSS
import { CartContext } from '../pages/CartContext'; // Importe o contexto do carrinho
//import { AuthContext } from '../pages/AuthContext'; // Importe o contexto de autenticação
//import { useNavigate } from 'react-router-dom';


const ProductDetail = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [recomendados, setRecomendados] = useState([]);
  //const [currentImageIndex, setCurrentImageIndex] = useState(0);
  //const [zoom, setZoom] = useState(false);
  const { addToCart } = useContext(CartContext); // Use o contexto do carrinho
  const [mainImage, setMainImage] = useState('');
  const [posts, setPosts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null); // Estado para o tamanho selecionado

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      const filtered = res.data.filter((p) => p.location === 'produtos');
      setPosts(filtered);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    }
  };

  fetchPosts();

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/produtos/${id}`);
        setProduto(response.data);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      }
    };

    fetchProduto();
  }, [id]);

  useEffect(() => {
    if (produto) {
      const fetchRecomendados = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/produtos/area/${produto.area}`);
          setRecomendados(response.data.filter(p => p.id !== produto.id));
        } catch (error) {
          console.error('Erro ao buscar produtos recomendados:', error);
        }
      };

      fetchRecomendados();
    }
  }, [produto]);

  useEffect(() => {
    if (produto) {
      const images = [
        produto.image_path,
        produto.image_path_1,
        produto.image_path_2,
        produto.image_path_3,
        produto.image_path_4
      ].filter(Boolean);
      setMainImage(images[0]); // Definindo a primeira imagem como principal
    }
  }, [produto]);

  const handleAddToCart = () => {
    if (!produto.disponivel) {
      alert('Este produto não está disponível no momento.');
      return;
    }

    if (!selectedSize) {
      alert('Por favor, selecione um tamanho.');
      return;
    }

    // Adiciona o produto ao carrinho com o tamanho selecionado
    addToCart({ ...produto, selectedSize });
    alert('Produto adicionado ao carrinho!');
  };

  if (!produto) {
    return <div>Carregando...</div>;
  }

  const imagens = [
    produto.image_path,
    produto.image_path_1,
    produto.image_path_2,
    produto.image_path_3,
    produto.image_path_4
  ].filter(Boolean);

  const handleThumbnailClick = (img) => {
    setMainImage(img);
  };
  

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        <div className="product-detail-left">
          <div className="product-image-main">
            {mainImage && (
              <img
                src={`http://localhost:5000/imagens/${mainImage}`}
                alt={produto.nome}
              />
            )}
          </div>
          <div className="product-thumbnails">
            {imagens.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000/imagens/${img}`}
                alt={produto.nome}
                onClick={() => handleThumbnailClick(img)}
              />
            ))}
          </div>
        </div>
        <div className="product-detail-right">
          <h1 className="product-detail-name">{produto.nome}</h1>
          <p className="product-detail-price">R$ {produto.preco}</p>
          <p className="product-detail-description">{produto.descricao}</p>

          {/* Exibir disponibilidade */}
          <p className="product-detail-availability">
            {produto.disponivel ? '' : 'produto Indisponível no momento'}
          </p>
{/* Exibir tamanhos disponíveis */}
{produto.disponivel && (
            <div className="product-sizes">
              <h3>Tamanhos Disponíveis:</h3>
              <div className="size-options">
                {produto.p && (
                  <button
                    className={`size-button ${selectedSize === 'P' ? 'selected' : ''}`}
                    onClick={() => setSelectedSize('P')}
                  >
                    P
                  </button>
                )}
                {produto.m && (
                  <button
                    className={`size-button ${selectedSize === 'M' ? 'selected' : ''}`}
                    onClick={() => setSelectedSize('M')}
                  >
                    M
                  </button>
                )}
                {produto.g && (
                  <button
                    className={`size-button ${selectedSize === 'G' ? 'selected' : ''}`}
                    onClick={() => setSelectedSize('G')}
                  >
                    G
                  </button>
                )}
                {produto.gg && (
                  <button
                    className={`size-button ${selectedSize === 'GG' ? 'selected' : ''}`}
                    onClick={() => setSelectedSize('GG')}
                  >
                    GG
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Botão de adicionar ao carrinho */}
          <button
            className="product-detail-button"
            onClick={handleAddToCart}
            disabled={!produto.disponivel} // Desabilita o botão se o produto não estiver disponível
          >
            {produto.disponivel ? 'Adicionar ao Carrinho' : 'Indisponível'}
          </button>
        </div>
      </div>
      
      <div  className="posts-grid">
      <h1>Posts produtos</h1>
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

                <h2 className="recommendations-title">Produtos Recomendados</h2>
<div className="recommendations-grid">
  {recomendados.map((produtoRecomendado) => (
    <Link 
      to={`/produtos/${produtoRecomendado.id}`} // Link para a página do produto
      key={produtoRecomendado.id} 
      className="recommendation-card-link"
    >
      <div className="recommendation-card">
        <img
          src={`http://localhost:5000/imagens/${produtoRecomendado.image_path}`}
          alt={produtoRecomendado.nome}
          className="recommendation-image"
        />
        <p className="recommendation-name">{produtoRecomendado.nome}</p>
        <p className="recommendation-price">R$ {produtoRecomendado.preco}</p>
        <button className="recommendation-button">Ver Produto</button>
      </div>
    </Link>
  ))}
</div>
    </div>
  );
};

export default ProductDetail;