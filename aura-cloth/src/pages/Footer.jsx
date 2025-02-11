import React, { useState } from 'react';
import './Footer.css'; // Importa o arquivo CSS
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';

const Footer = () => {

  const [banners, setBanners] = useState([]);

  const fetchBanners = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/banners');
      const filtered = res.data.filter((b) => b.location === 'Footer');
      setBanners(filtered);
    } catch (error) {
      console.error('Erro ao buscar banners:', error);
    }
  };

  fetchBanners();

  return (
    <footer className="footer-container">
      {/* Exibe o carousel de banners */}
      <Carousel autoPlay interval={3000} infiniteLoop showThumbs={false} showStatus={false}>
        {banners.map((banner) => (
          <div key={banner.id}>
            <img
              src={`http://localhost:5000/imagens/${banner.image_path}`}
              alt={banner.nome}
            />
          </div>
        ))}
      </Carousel>
      <div className="footer-instagram">
        <p>Conheça o nosso Instagram</p>
        <img src="/images/bannerinsta.png" alt="Instagram da Loja" className="instagram-banner" />
        <h2>@auraclothbase</h2>
      </div>
      <div className="footer-main">
        <div className="footer-column">
          <h3>Central de Atendimento</h3>
          <p>Telefone: (11) 1234-5678</p>
          <p>WhatsApp: (11) 98765-4321</p>
          <p>Email: atendimento@auraclothbase.com</p>
          <p>Horário de Atendimento: Seg-Sex, 9h-18h</p>
        </div>
        <div className="footer-column">
          <h3>Lojas Físicas</h3>
          <p>Endereço 1</p>
          <p>Endereço 2</p>
          <p>Endereço 3</p>
        </div>
        <div className="footer-column">
          <h3>Minha Conta</h3>
          <p>Meu Cadastro</p>
          <p>Meus Pedidos</p>
          <p>Meu Carrinho</p>
          <p>Endereço de Entrega</p>
          <p>Alterar Senha</p>
          <p>Alterar Cadastro</p>
        </div>
        <div className="footer-column">
          <h3>Dúvidas</h3>
          <p>Como Comprar</p>
          <p>Políticas de Entrega</p>
          <p>Troca e Devolução</p>
          <p>Política de Privacidade</p>
        </div>
        <div className="footer-column">
          <h3>Categorias</h3>
          <p>Lançamentos</p>
          <p>Promo</p>
          <p>Mais Vendidos</p>
        </div>
      </div>
      <div className="footer-bottom-bar">
        <p>Boas compras na Aura</p>
      </div>
    </footer>
  );
};

export default Footer;