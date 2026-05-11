import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Produits from './pages/Produits';
import Categories from './pages/Categories';
import Stock from './pages/Stock';
import AdminUsers from './pages/AdminUsers';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/produits" element={
            <PrivateRoute><Produits /></PrivateRoute>
          } />
          <Route path="/categories" element={
            <PrivateRoute><Categories /></PrivateRoute>
          } />
          <Route path="/stock" element={
            <PrivateRoute><Stock /></PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute adminOnly={true}><AdminUsers /></PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
