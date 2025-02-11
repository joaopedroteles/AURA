import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth', {
          headers: {
            'user-id': userId
          }
        });
        setAuthData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Usuário não autenticado:', error);
          // Limpar dados de autenticação se o usuário não estiver autenticado
          setAuthData(null);
          localStorage.removeItem('userId');
        } else {
          console.error('Erro ao buscar dados de autenticação:', error);
        }
      }
    };

    fetchAuthData();
  }, []);

  const logout = () => {
    localStorage.removeItem('userId');
    setAuthData(null);
  };

  return (
    <AuthContext.Provider value={{ authData, setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};