import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">▣</span>
        <span className="logo-text">Stock<b>Pro</b></span>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-label">Menu</p>

        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">◈</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/produits" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">◫</span>
          <span>Produits</span>
        </NavLink>

        <NavLink to="/categories" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">◧</span>
          <span>Catégories</span>
        </NavLink>

        <NavLink to="/stock" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">◩</span>
          <span>Mouvements</span>
        </NavLink>

        {isAdmin() && (
          <>
            <p className="nav-section-label" style={{ marginTop: '1.5rem' }}>Admin</p>
            <NavLink to="/admin/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">◎</span>
              <span>Utilisateurs</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="user-avatar">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <p className="user-email">{user?.email}</p>
            <p className="user-role">{user?.role === 'ROLE_ADMIN' ? 'Administrateur' : 'Gestionnaire'}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          ⏻ Déconnexion
        </button>
      </div>
    </aside>
  );
}
