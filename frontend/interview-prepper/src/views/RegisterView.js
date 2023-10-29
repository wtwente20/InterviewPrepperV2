import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { userService } from '../services/userService';

function RegisterView() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    status: ''
  });
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be 6 characters or more';
      valid = false;
    }

    if (!formData.status) {
      newErrors.status = 'Please select a status';
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

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        await userService.register(formData);
        history.push('/login');
      } catch (error) {
        console.error('Registration failed', error);
        setErrors({ form: 'Registration failed. Please try again later.' });
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {errors.form && <p>{errors.form}</p>}
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      />
      {errors.username && <p>{errors.username}</p>}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      {errors.email && <p>{errors.email}</p>}
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      {errors.password && <p>{errors.password}</p>}
      <div>
        <label>
          <input
            type="radio"
            name="status"
            value="Mentor"
            checked={formData.status === "MENTOR"}
            onChange={handleChange}
          />
          Mentor
        </label>
        <label>
          <input
            type="radio"
            name="status"
            value="Learner"
            checked={formData.status === "LEARNER"}
            onChange={handleChange}
          />
          Learner
        </label>
      </div>
      {errors.status && <p>{errors.status}</p>}
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default RegisterView;
