import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('https://tutedude-backend-1.onrender.com/api/login', {
        name,
        password,
      });
      Cookies.set('token', response.data.token, { expires: 7 });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error logging in');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="login-error">{error}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label className="login-label">Name:</label>
          <input
            className="login-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="login-form-group">
          <label className="login-label">Password:</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
      <button className="register-button" onClick={handleRegisterRedirect}>
        Go to Register
      </button>
    </div>
  );
};

export default Login;
