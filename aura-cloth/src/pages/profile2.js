// Profile.js - React Component
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../pages/AuthContext';
import './Profile.css';

const Profile = () => {
  const { authData, setAuthData } = useContext(AuthContext);
  const [userData, setUserData] = useState({ nome: '', telefone: '', endereco: '' });
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [passwordVerificationCode, setPasswordVerificationCode] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (authData && authData.user) {
      setUserData({
        nome: authData.user.nome || '',
        telefone: authData.user.telefone || '',
        endereco: authData.user.endereco || '',
      });
    }
  }, [authData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`/api/users/${authData.user.id}`, userData);
      setAuthData({ ...authData, user: response.data });
      setMessage('Perfil atualizado com sucesso!');
    } catch (error) {
      setMessage('Erro ao atualizar perfil.');
    }
  };

  const handleEmailChange = async () => {
    try {
      await axios.post(`/api/users/${authData.user.id}/send-email-code`, { newEmail });
      setMessage('Código de verificação enviado para o novo e-mail.');
    } catch (error) {
      setMessage('Erro ao enviar código de verificação para o e-mail.');
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const response = await axios.post(`/api/users/${authData.user.id}/verify-email`, {
        newEmail,
        verificationCode: emailVerificationCode,
      });
      setAuthData({ ...authData, user: response.data });
      setMessage('E-mail atualizado com sucesso!');
    } catch (error) {
      setMessage('Erro ao verificar o código do e-mail.');
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.post(`/api/users/${authData.user.id}/send-password-code`);
      setMessage('Código de verificação enviado para o seu e-mail.');
    } catch (error) {
      setMessage('Erro ao enviar código de verificação para a senha.');
    }
  };

  const handleVerifyPassword = async () => {
    try {
      await axios.post(`/api/users/${authData.user.id}/verify-password`, {
        newPassword,
        verificationCode: passwordVerificationCode,
      });
      setMessage('Senha atualizada com sucesso!');
    } catch (error) {
      setMessage('Erro ao verificar o código da senha.');
    }
  };

  return (
    <div className="profile-container">
      <h1>Meu Perfil</h1>
      {message && <p>{message}</p>}
      <div className="profile-section">
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
        <h2>Alterar E-mail</h2>
        <input
          type="email"
          placeholder="Novo E-mail"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button onClick={handleEmailChange}>Enviar Código</button>
        <input
          type="text"
          placeholder="Código de Verificação"
          value={emailVerificationCode}
          onChange={(e) => setEmailVerificationCode(e.target.value)}
        />
        <button onClick={handleVerifyEmail}>Verificar</button>
      </div>
      <div className="password-section">
        <h2>Alterar Senha</h2>
        <input
          type="password"
          placeholder="Nova Senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handlePasswordChange}>Enviar Código</button>
        <input
          type="text"
          placeholder="Código de Verificação"
          value={passwordVerificationCode}
          onChange={(e) => setPasswordVerificationCode(e.target.value)}
        />
        <button onClick={handleVerifyPassword}>Verificar</button>
      </div>
    </div>
  );
};

export default Profile;