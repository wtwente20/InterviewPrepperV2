import AuthService from '../utils/authService';

const initialState = {
  isAuthenticated: !!AuthService.getCurrentUser(),
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    default:
      return state;
  }
}

export default authReducer;
