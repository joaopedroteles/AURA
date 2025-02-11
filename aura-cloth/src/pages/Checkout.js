import React, { useContext, useState, useEffect, useMemo } from 'react';
import './Checkout.css'; // Importa o arquivo CSS
import { CartContext } from '../pages/CartContext'; // Importe o contexto do carrinho
import axios from 'axios';
import { AuthContext } from '../pages/AuthContext';

const Checkout = () => {
  const { cartItems } = useContext(CartContext);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [coupon, setCoupon] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [discount, setDiscount] = useState(0);
  const { authData } = useContext(AuthContext);

  const subTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.preco * item.quantity, 0);
  }, [cartItems]);

  const total = useMemo(() => {
    const descFactor = 1 - discount / 100;
    return (subTotal * descFactor).toFixed(2);
  }, [subTotal, discount]);

  const handleCheckout = async (e) => {
    e.preventDefault();
  
    const orderData = {
      user_id: authData.user.id,
      name,
      address,
      paymentMethod,
      cartItems: cartItems.map(item => ({
        id: item.id, // ID do produto
        preco: item.preco, // Preço unitário
        quantity: item.quantity, // Quantidade
        selectedSize: item.selectedSize, // Tamanho escolhido
      })),
      discount,
      total,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      console.log('Compra finalizada:', response.data);
      // Redirecionar para a página de confirmação de pedido ou exibir mensagem de sucesso
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
    }
  };

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

  const handleApplyCoupon = () => {
    if (!coupon) return;

    const foundCoupon = coupons.find((c) => c.code === coupon);
    if (foundCoupon) {
      setDiscount(foundCoupon.discount); 
      alert(`Cupom aplicado! Desconto de ${foundCoupon.discount}%`);
    } else {
      alert('Cupom inválido!');
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Finalizar Compra</h1>
      <form className="checkout-form" onSubmit={handleCheckout}>
        <div className="checkout-form-group">
          <label htmlFor="name">Nome Completo</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="checkout-form-group">
          <label htmlFor="address">Endereço</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="checkout-form-group">
          <label htmlFor="payment-method">Método de Pagamento</label>
          <select
            id="payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="credit-card">Cartão de Crédito</option>
            <option value="debit-card">Cartão de Débito</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
         {/* Resumo do Carrinho */}
         <div className="cart-summary-container">
          <h2>Resumo do Pedido</h2>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={`http://localhost:5000/imagens/${item.image_path}`}
                  alt={item.nome}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.nome}</h3>
                  <p>Preço: R$ {Number(item.preco).toFixed(2)}</p>
                  <p>Quantidade: {item.quantity}</p>
                  {item.selectedSize && <p>Tamanho: {item.selectedSize}</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="cart-coupon">
            <input
              type="text"
              placeholder="Digite o cupom de desconto"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button type="button" onClick={handleApplyCoupon}>
              Aplicar Cupom
            </button>
          </div>
          <div className="checkout-total">
            <h2>Total: R$ {total}</h2>
          </div>
        </div>

        <button type="submit" className="checkout-button">Finalizar Compra</button>
      </form>
    </div>
  );
};

export default Checkout;