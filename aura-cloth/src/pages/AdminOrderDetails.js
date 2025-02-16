import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const AdminOrderDetails = () => {
  const [orders, setOrders] = useState([]); // Lista de todos os pedidos
  const [selectedOrder, setSelectedOrder] = useState(null); // Pedido selecionado
  const [newStatus, setNewStatus] = useState(''); // Novo status para atualização

  // Busca todos os pedidos ao carregar a página
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      }
    };

    fetchOrders();
  }, []);

  // Busca os detalhes de um pedido específico
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
    }
  };

  // Atualiza o status de um pedido
  const handleUpdateStatus = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      // Atualiza o status na lista de pedidos
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setNewStatus(''); // Limpa o campo de status
      alert('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      alert('Erro ao atualizar status.');
    }
  };

  // Seleciona um pedido para exibir os detalhes
  const handleSelectOrder = (order) => {
    fetchOrderDetails(order.id);
  };

  return (
    <div className="admin-container">
      <h1>Detalhes dos Pedidos</h1>

      {/* Lista de Pedidos */}
      <div className="orders-list">
        <h2>Lista de Pedidos</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>Total</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={selectedOrder?.id === order.id ? 'selected' : ''}
                onClick={() => handleSelectOrder(order)}
              >
                <td>{order.id}</td>
                <td>{order.user_id}</td>
                <td>R$ {order.total}</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={() => handleSelectOrder(order)}>
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detalhes do Pedido Selecionado */}
      {selectedOrder && (
        <div className="order-details">
          <h2>Detalhes do Pedido #{selectedOrder.id}</h2>
          <div className="order-info">
            <p>
              <strong>Cliente:</strong> {selectedOrder.user_id}
            </p>
            <p>
              <strong>Total:</strong> R$ {selectedOrder.total}
            </p>
            <p>
              <strong>Status Atual:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Data do Pedido:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}
            </p>
          </div>
          
         {/* Atualizar Status */}
         <div className="status-update">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Selecione novo status</option>
              <option value="pendente">Pendente</option>
              <option value="processando">Processando</option>
              <option value="enviado">Enviado</option>
              <option value="entregue">Entregue</option>
              <option value="cancelado">Cancelado</option>
            </select>
            <button onClick={() => handleUpdateStatus(selectedOrder.id)}>
              Atualizar Status
            </button>
          </div>

          {/* Itens do Pedido */}
          <h3>Itens do Pedido</h3>
          <div className="order-items-grid">
            {selectedOrder.items && selectedOrder.items.length > 0 ? (
              selectedOrder.items.map((item) => (
                <div key={item.id} className="order-item-card">
                  {item.product && (
                    <>
                      <img
                      src={`http://localhost:5000/imagens/${item.product.image_path}`}
                        alt={item.product.nome}
                      />
                      <div>
                        <h4>{item.product.nome}</h4>
                        <p>Quantidade: {item.quantity}</p>
                        {item.size && <p>Tamanho: {item.size}</p>}
                        <p>Preço Unitário: R$ {item.price}</p>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p>Nenhum item encontrado neste pedido.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderDetails;