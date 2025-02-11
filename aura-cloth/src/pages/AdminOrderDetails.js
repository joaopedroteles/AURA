import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
            params: {
              includeItems: true // Adicione este parâmetro se necessário
            }
          });
          setOrder(response.data);
        } catch (error) {
          console.error('Erro ao buscar detalhes do pedido:', error);
        }
      };
  
      fetchOrderDetails();
    }, [id]);

  const handleUpdateStatus = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status: newStatus });
      navigate ('/admin');
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
    }
  };

  if (!order) return <div>Carregando...</div>;

  return (
    <div className="admin-container">
      <h1>Detalhes do Pedido #{order.id}</h1>
      
      <div className="order-details">
        <div className="order-info">
          <p><strong>Cliente:</strong> {order.name}</p>
          <p><strong>Endereço:</strong> {order.address}</p>
          <p><strong>Total:</strong> R$ {order.total}</p>
          <p><strong>Status Atual:</strong> {order.status}</p>
        </div>

        <div className="status-update">
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="">Selecione novo status</option>
            <option value="pendente">Pendente</option>
            <option value="processando">Processando</option>
            <option value="enviado">Enviado</option>
            <option value="entregue">Entregue</option>
            <option value="cancelado">Cancelado</option>
          </select>
          <button onClick={handleUpdateStatus}>Atualizar Status</button>
        </div>

        <h2>Itens do Pedido</h2>
        <div className="order-details-container">
      {/* ... resto do código ... */}
      
      <h2>Itens do Pedido</h2>
      <div className="order-items-grid">
        {/* Adicione verificação para OrderItems */}
        {order.OrderItems?.length > 0 ? (
          order.OrderItems.map((item) => (
            <div key={item.id} className="order-item-card">
              <img 
                src={`http://localhost:5000/imagens/${item.Product?.image_path}`} 
                alt={item.Product?.nome}
              />
              <div>
                <h3>{item.Product?.nome}</h3>
                <p>Quantidade: {item.quantity}</p>
                {item.size && <p>Tamanho: {item.size}</p>}
                <p>Preço Unitário: R$ {item.price}</p>
              </div>
              </div>
          ))
        ) : (
          <p>Nenhum item encontrado neste pedido.</p>
        )}
      </div>
    </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;