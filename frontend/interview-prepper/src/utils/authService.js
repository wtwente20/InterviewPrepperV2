import { jwtDecode } from 'jwt-decode';

const AuthService = {
  login(response) {
    if (response.token) {
      localStorage.setItem('user', JSON.stringify(response));
    }
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      const decoded = jwtDecode(user.token);
      return {
        id: decoded.userId,
        role: decoded.role,
        ...user,
      };
    }
    return null;
  },

  authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      return { Authorization: 'Bearer ' + user.token };
    } else {
      return {};
    }
  }
};

export default AuthService;
