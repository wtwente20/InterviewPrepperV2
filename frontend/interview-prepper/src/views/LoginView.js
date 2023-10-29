import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { userService } from '../services/userService';

function LoginView() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const history = useHistory();

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

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        await userService.login(formData);
        history.push('/dashboard');
      } catch (error) {
        console.error('Login failed: ', error);
        setErrors({ form: 'Login failed. Please check your credentials and try again.' });
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {errors.form && <p>{errors.form}</p>}
      <input
        type="text"
        name="identifier"
        placeholder="Username or Email"
        value={formData.identifier}
        onChange={handleChange}
      />
      {errors.identifier && <p>{errors.identifier}</p>}
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      {errors.password && <p>{errors.password}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginView;
