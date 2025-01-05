import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Register = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await axios.post('https://tutedude-backend-1.onrender.com/api/register', {
        name,
        password,
        hobbies: hobbies.split(',').map((hobby) => hobby.trim()),
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering the user');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      {error && <p className="register-error">{error}</p>}
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="register-form-group">
          <label className="register-label">Name:</label>
          <input
            className="register-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="register-form-group">
          <label className="register-label">Password:</label>
          <input
            className="register-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="register-form-group">
          <label className="register-label">Hobbies:</label>
          <input
            className="register-input"
            type="text"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            placeholder="Comma separated hobbies"
          />
        </div>
        <button className="register-button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
