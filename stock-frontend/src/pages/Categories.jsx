import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ nom: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.post('/categories', form);
      setSuccess('Catégorie ajoutée');
      setForm({ nom: '', description: '' });
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Catégories</h1>
          <p className="page-subtitle">{categories.length} catégories</p>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '1rem' }}>Nouvelle catégorie</h3>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input className="input" placeholder="Nom de la catégorie" value={form.nom}
                  onChange={e => setForm({ ...form, nom: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="input" placeholder="Description" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <button className="btn btn-primary" type="submit" style={{ alignSelf: 'flex-end' }}>Ajouter</button>
            </div>
          </form>
        </div>

        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>Aucune catégorie</td></tr>
                ) : categories.map(c => (
                  <tr key={c.id}>
                    <td><span className="badge badge-blue">{c.nom}</span></td>
                    <td style={{ color: '#888' }}>{c.description || '—'}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
