import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../components/Navbar.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      setSuccess('Compte créé ! Redirection...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Stock<span>Pro</span></div>
        <p className="auth-subtitle">Créez votre compte gestionnaire</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <input className="input" type="text" placeholder="Nom d'utilisateur"
              value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            <input className="input" type="email" placeholder="Email"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input className="input" type="password" placeholder="Mot de passe"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Création...' : "Créer mon compte"}
          </button>
        </form>

        <p className="auth-link">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
