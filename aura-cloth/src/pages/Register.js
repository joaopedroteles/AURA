import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Importar o CSS para estilização

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', {
        username,
        password,
      });
      setMessage('Usuário registrado com sucesso!');
      setTimeout(() => navigate('/login'), 1500); // Redireciona para a página de login
    } catch (error) {
      setMessage('Erro ao registrar usuário.');
      console.error('Erro ao registrar usuário:', error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Registrar</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Registrar</button>
        </form>
        {message && <p className="message">{message}</p>}
        <button className="back-to-login-button" onClick={() => navigate('/login')}>
          Voltar para Login
        </button>
      </div>
    </div>
  );
};

export default Register;

