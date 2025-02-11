import React, { useContext, useState, useEffect, useMemo } from 'react';
import './Cart.css'; // Importa o arquivo CSS
import { CartContext } from '../pages/CartContext'; // Importe o contexto do carrinho
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/coupons');
        setCoupons(response.data);
      } catch (error) {
        console.error('Erro ao buscar cupons:', error);
      }
    };

    fetchCoupons();
  }, []);

  const total = useMemo(() => {
    return (cartItems.reduce((acc, item) => acc + item.preco * item.quantity, 0) * (1 - discount / 100)).toFixed(2);
  }, [cartItems, discount]);

  const handleCheckout = () => {
    navigate('/checkout', { state: { cartItems, discount } });
  };

  const handleApplyCoupon = () => {
    const foundCoupon = coupons.find(c => c.code === coupon);
    if (foundCoupon) {
      setDiscount(foundCoupon.discount);
      alert(`Cupom aplicado! Desconto de ${foundCoupon.discount}%`);
    } else {
      alert('Cupom inválido');
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-box">
        <div className="cart-items-container">
          <h1 className="cart-title">Meu Carrinho</h1>
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <p className="empty-cart">Seu carrinho está vazio</p>
            ) : (
              cartItems.map(item => (
                <div className="cart-item" key={item.id}>
                  <img src={`http://localhost:5000/imagens/${item.image_path}`} alt={item.nome} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h2 className="cart-item-name">{item.nome}</h2>
                    <p className="cart-item-price">R$ {Number(item.preco).toFixed(2)}</p>
                    
                    {/* Exibir o tamanho selecionado */}
                    {item.selectedSize && (
                      <p className="cart-item-size">Tamanho: {item.selectedSize}</p>
                    )}
                    
                    <div className="quantity-controls">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const userVal = parseInt(e.target.value);
                          updateQuantity(item.id, userVal > -1 ? userVal : 1);
                        }}
                        min="0"
                      />
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="remove-button"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="cart-summary-container">
          <div className="cart-summary">
            <div className="cart-coupon">
              <input
                type="text"
                placeholder="Digite o cupom de desconto"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button onClick={handleApplyCoupon}>Aplicar Cupom</button>
            </div>
            <div className="cart-total">
              <h2>Total: R$ {total}</h2>
            </div>
            <button className="cart-checkout-button" onClick={handleCheckout}>Finalizar Compra</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;