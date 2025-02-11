import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../pages/AuthContext';
import './Profile.css';

const Profile = () => {
  const { authData, setAuthData } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState({
    nome: '',
    telefone: '',
    endereco: '',
  });
  const [message, setMessage] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  
  const navigate = useNavigate();

  const handleAdminAccess = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = () => {
    const adminPassword = '21232528'; // Defina a senha numérica aqui
    if (password === adminPassword) {
      navigate('/admin');
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/usuarios/${authData.user.id}`, userData);
      setAuthData({ ...authData, user: response.data });
      setMessage('Perfil atualizado com sucesso!');
    } catch (error) {
      setMessage('Erro ao atualizar o perfil. Tente novamente.');
    }
  };

  const handleEmailChange = async () => {
    try {
      await axios.post(`http://localhost:5000/api/usuarios/${authData.id}/send-verification-code`, { newEmail });
      setEmailMessage('Código de verificação enviado para o novo email.');
    } catch (error) {
      setEmailMessage('Erro ao enviar código de verificação. Tente novamente.');
    }
  };

  const handleEmailVerification = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/usuarios/${authData.id}/verify-email`, { newEmail, verificationCode });
      setAuthData({ ...authData, email: response.data.email });
      setEmailMessage('Email atualizado com sucesso!');
    } catch (error) {
      setEmailMessage('Erro ao verificar o código. Tente novamente.');
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.post(`http://localhost:5000/api/usuarios/${authData.id}/send-password-code`);
      setPasswordMessage('Código de verificação enviado para o email.');
    } catch (error) {
      setPasswordMessage('Erro ao enviar código de verificação. Tente novamente.');
    }
  };

  const handlePasswordVerification = async () => {
    try {
      await axios.post(`http://localhost:5000/api/usuarios/${authData.id}/verify-password`, { newPassword, verificationCode });
      setPasswordMessage('Senha atualizada com sucesso!');
    } catch (error) {
      setPasswordMessage('Erro ao verificar o código. Tente novamente.');
    }
  };

  useEffect(() => {
    if (authData && authData.id) {
      // Fill in the fields with user data
      setUserData({
        nome: authData.nome || '',
        telefone: authData.telefone || '',
        endereco: authData.endereco || '',
      });
    }
  }, [authData]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pedidos?usuario_id=${authData.user.id}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      }
    };

    if (authData && authData.id) {
      fetchOrders();
    }
  }, [authData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="profile-container">
      <h1 className="profile-title">Meu Perfil</h1>
      {message && <p className="message">{message}</p>}
      <div className="profile-form">
        <label>Nome:</label>
        <input
          type="text"
          name="nome"
          value={userData.nome}
          onChange={handleInputChange}
        />
        <label>Telefone:</label>
        <input
          type="text"
          name="telefone"
          value={userData.telefone}
          onChange={handleInputChange}
        />
        <label>Endereço:</label>
        <textarea
          name="endereco"
          value={userData.endereco}
          onChange={handleInputChange}
        />
        <button onClick={handleSaveChanges}>Salvar Alterações</button>
      </div>
      <div className="email-section">
        <h2>Alterar Email</h2>
        <input
          type="email"
          placeholder="Novo Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button onClick={handleEmailChange}>Enviar Código de Verificação</button>
        <input
          type="text"
          placeholder="Código de Verificação"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button onClick={handleEmailVerification}>Verificar Código</button>
        {emailMessage && <p className="message">{emailMessage}</p>}
      </div>
      <div className="password-section">
        <h2>Alterar Senha</h2>
        <input
          type="password"
          placeholder="Nova Senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handlePasswordChange}>Enviar Código de Verificação</button>
        <input
          type="text"
          placeholder="Código de Verificação"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button onClick={handlePasswordVerification}>Verificar Código</button>
        {passwordMessage && <p className="message">{passwordMessage}</p>}
      </div>
      <div className="orders-section">
        <h2>Meus Pedidos</h2>
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-item">
              <p>Produto: {order.produto_id}</p>
              <p>Status: {order.status}</p>
              <p>Data do Pedido: {new Date(order.data_pedido).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
      {authData?.is_admin && (
        <div className='admin-access'>
          <button onClick={handleAdminAccess}>Acessar Administração</button>
          {showPasswordPrompt && (
            <div>
              <input
                type="password"
                placeholder="Digite a senha numérica"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handlePasswordSubmit}>Enviar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;