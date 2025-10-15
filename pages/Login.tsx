import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const { user, signInWithGoogle, loading } = useAuth();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-container">
          {/* O logotipo será adicionado aqui via CSS */}
        </div>
        <h2 className="login-title">Bem-vindo de volta</h2>
        <p className="login-subtitle">Faça login para continuar</p>
        <button className="login-button" onClick={signInWithGoogle}>
          <span className="google-icon"></span>
          Entrar com o Google
        </button>
      </div>
    </div>
  );
};

export default Login;