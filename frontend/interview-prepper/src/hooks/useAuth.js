import { useSelector } from 'react-redux';

function useAuth() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated;
}

export default useAuth;
