import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const emptyForm = { produitId: '', type: 'ENTREE', quantite: '', motif: '' };

export default function Stock() {
  const { isAdmin } = useAuth();
  const [mouvements, setMouvements] = useState([]);
  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAll = async () => {
    const [s, p] = await Promise.all([api.get('/stock'), api.get('/produits')]);
    setMouvements(s.data);
    setProduits(p.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.post('/stock', {
        produit: { id: parseInt(form.produitId) },
        type: form.type,
        quantite: parseInt(form.quantite),
        motif: form.motif
      });
      setSuccess('Mouvement enregistré');
      setForm(emptyForm);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur — stock insuffisant ?');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce mouvement ?')) return;
    await api.delete(`/stock/${id}`);
    fetchAll();
  };

  const filtered = mouvements.filter(m => filter === 'ALL' || m.type === filter);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Mouvements de stock</h1>
          <p className="page-subtitle">{mouvements.length} mouvements enregistrés</p>
        </div>

        {/* New movement form */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '1rem' }}>Nouveau mouvement</h3>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Produit *</label>
                <select className="input" value={form.produitId}
                  onChange={e => setForm({ ...form, produitId: e.target.value })} required>
                  <option value="">Choisir un produit</option>
                  {produits.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nom} — stock actuel: {p.quantiteStock}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Type *</label>
                <select className="input" value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="ENTREE">↑ Entrée</option>
                  <option value="SORTIE">↓ Sortie</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantité *</label>
                <input className="input" type="number" min="1" placeholder="0" value={form.quantite}
                  onChange={e => setForm({ ...form, quantite: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Motif</label>
                <input className="input" placeholder="Raison du mouvement" value={form.motif}
                  onChange={e => setForm({ ...form, motif: e.target.value })} />
              </div>
            </div>
            <button className="btn btn-primary" type="submit">Enregistrer</button>
          </form>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
          {['ALL', 'ENTREE', 'SORTIE'].map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(f)}>
              {f === 'ALL' ? 'Tous' : f === 'ENTREE' ? '↑ Entrées' : '↓ Sorties'}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Type</th>
                  <th>Quantité</th>
                  <th>Motif</th>
                  <th>Date</th>
                  {isAdmin() && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>Aucun mouvement</td></tr>
                ) : filtered.map(m => (
                  <tr key={m.id}>
                    <td><strong>{m.produit?.nom}</strong></td>
                    <td>
                      <span className={`badge ${m.type === 'ENTREE' ? 'badge-green' : 'badge-red'}`}>
                        {m.type === 'ENTREE' ? '↑ Entrée' : '↓ Sortie'}
                      </span>
                    </td>
                    <td><strong>{m.quantite}</strong></td>
                    <td style={{ color: '#888' }}>{m.motif || '—'}</td>
                    <td style={{ color: '#aaa', fontSize: '12px' }}>
                      {new Date(m.date).toLocaleString('fr-FR')}
                    </td>
                    {isAdmin() && (
                      <td>
                        <button className="btn btn-danger" onClick={() => handleDelete(m.id)}>Supprimer</button>
                      </td>
                    )}
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
