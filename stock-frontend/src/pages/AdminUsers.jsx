import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, newRole) => {
    setError(''); setSuccess('');
    try {
      await api.put(`/admin/users/${id}/role?role=${newRole}`);
      setSuccess('Rôle mis à jour');
      fetchUsers();
    } catch (err) {
      setError('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setSuccess('Utilisateur supprimé');
      fetchUsers();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Utilisateurs</h1>
          <p className="page-subtitle">{users.length} comptes enregistrés</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Stats row */}
        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card" style={{ '--accent': '#a060f0' }}>
            <p className="stat-label">Total utilisateurs</p>
            <p className="stat-value">{users.length}</p>
          </div>
          <div className="stat-card" style={{ '--accent': '#ff6b6b' }}>
            <p className="stat-label">Administrateurs</p>
            <p className="stat-value">{users.filter(u => u.role === 'ROLE_ADMIN').length}</p>
          </div>
          <div className="stat-card" style={{ '--accent': '#c8f060' }}>
            <p className="stat-label">Gestionnaires</p>
            <p className="stat-value">{users.filter(u => u.role === 'ROLE_USER').length}</p>
          </div>
        </div>

        <div className="card">
          {loading ? (
            <p style={{ color: '#999', padding: '2rem', textAlign: 'center' }}>Chargement...</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: u.role === 'ROLE_ADMIN' ? '#1a1a1a' : '#e8f0fd',
                            color: u.role === 'ROLE_ADMIN' ? '#c8f060' : '#1a4fa0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '13px', flexShrink: 0
                          }}>
                            {u.username?.charAt(0).toUpperCase()}
                          </div>
                          <strong>{u.username}</strong>
                        </div>
                      </td>
                      <td style={{ color: '#888' }}>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-gray' : 'badge-blue'}`}>
                          {u.role === 'ROLE_ADMIN' ? 'Admin' : 'Gestionnaire'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.enabled ? 'badge-green' : 'badge-red'}`}>
                          {u.enabled ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {u.role === 'ROLE_USER' ? (
                            <button className="btn btn-warning"
                              onClick={() => handleRoleChange(u.id, 'ROLE_ADMIN')}>
                              → Admin
                            </button>
                          ) : (
                            <button className="btn btn-ghost"
                              onClick={() => handleRoleChange(u.id, 'ROLE_USER')}>
                              → User
                            </button>
                          )}
                          <button className="btn btn-danger" onClick={() => handleDelete(u.id)}>
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
