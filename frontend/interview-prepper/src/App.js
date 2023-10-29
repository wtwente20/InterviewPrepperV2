import React from 'react';
import { Provider } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Login from './components/login';
import Register from './components/register';
import useAuth from './hooks/useAuth';
import store from './store'; // Adjust this path according to your project structure

function App() {
  const isAuthenticated = useAuth();

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
