import axios from 'axios';
import authService from '../utils/authService';

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL + "/users/",
  headers: {
    "Content-Type": "application/json",
  },
});

const register = async (userData) => {
  try {
    const response = await axiosInstance.post("register", userData);
    if (response.data.token) {
      authService.login(response.data);
    }
    return response.data;
  } catch (error) {
    console.error("Registration failed", error.response?.data || error.message);
    throw error;
  }
};

const login = async (userData) => {
  try {
    const response = await axiosInstance.post("login", userData);
    if (response.data.token) {
      authService.login(response.data);
    }
    return response.data;
  } catch (error) {
    console.error("Login failed", error.response?.data || error.message);
    throw error;
  }
};

const userService = {
  register,
  login
};

export default userService;

