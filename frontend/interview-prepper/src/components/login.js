import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import userService from '../services/userService';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Username or Email is required';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await userService.login(formData);
        dispatch({ type: 'LOGIN', payload: response });
        setMessage("Logged in successfully");
        navigate('/dashboard');
      } catch (error) {
        console.error('Login failed: ', error);
        setMessage(error.response?.data?.message || "Login failed");
      }
    }
  };
  

  return (
    <div>
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email:
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            required
          />
        </label>
        {errors.identifier && <p>{errors.identifier}</p>}
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
