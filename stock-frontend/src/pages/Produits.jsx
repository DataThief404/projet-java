import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const emptyForm = { nom: '', description: '', prix: '', quantiteStock: '', categorieId: '' };

export default function Produits() {
  const { isAdmin } = useAuth();
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchAll = async () => {
    const [p, c] = await Promise.all([api.get('/produits'), api.get('/categories')]);
    setProduits(p.data);
    setCategories(c.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const payload = {
        nom: form.nom,
        description: form.description,
        prix: parseFloat(form.prix),
        quantiteStock: parseInt(form.quantiteStock),
        categorie: form.categorieId ? { id: parseInt(form.categorieId) } : null
      };
      if (editId) {
        await api.put(`/produits/${editId}`, payload);
        setSuccess('Produit modifié');
      } else {
        await api.post('/produits', payload);
        setSuccess('Produit ajouté');
      }
      setForm(emptyForm); setEditId(null); setShowForm(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({
      nom: p.nom, description: p.description || '',
      prix: p.prix, quantiteStock: p.quantiteStock,
      categorieId: p.categorie?.id || ''
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    await api.delete(`/produits/${id}`);
    fetchAll();
  };

  const filtered = produits.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Produits</h1>
            <p className="page-subtitle">{produits.length} références</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}>
            {showForm ? '✕ Fermer' : '+ Nouveau produit'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '1rem' }}>
              {editId ? 'Modifier le produit' : 'Ajouter un produit'}
            </h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nom *</label>
                  <input className="input" placeholder="Nom du produit" value={form.nom}
                    onChange={e => setForm({ ...form, nom: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input className="input" placeholder="Description" value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prix (DT) *</label>
                  <input className="input" type="number" step="0.01" placeholder="0.00" value={form.prix}
                    onChange={e => setForm({ ...form, prix: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantité initiale *</label>
                  <input className="input" type="number" placeholder="0" value={form.quantiteStock}
                    onChange={e => setForm({ ...form, quantiteStock: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Catégorie</label>
                  <select className="input" value={form.categorieId}
                    onChange={e => setForm({ ...form, categorieId: e.target.value })}>
                    <option value="">Sans catégorie</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary" type="submit">{editId ? 'Modifier' : 'Ajouter'}</button>
                <button className="btn btn-ghost" type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {success && <div className="alert alert-success">{success}</div>}

        {/* Search */}
        <div style={{ marginBottom: '1rem' }}>
          <input className="input" style={{ maxWidth: '300px' }} placeholder="Rechercher un produit..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Table */}
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>Aucun produit</td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{p.nom}</div>
                      <div style={{ fontSize: '12px', color: '#aaa' }}>{p.description}</div>
                    </td>
                    <td>
                      {p.categorie
                        ? <span className="badge badge-blue">{p.categorie.nom}</span>
                        : <span style={{ color: '#ccc' }}>—</span>}
                    </td>
                    <td><strong>{p.prix?.toFixed(2)} DT</strong></td>
                    <td>
                      <span className={`badge ${p.quantiteStock < 5 ? 'badge-red' : p.quantiteStock < 20 ? 'badge-amber' : 'badge-green'}`}>
                        {p.quantiteStock} unités
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-warning" onClick={() => handleEdit(p)}>Modifier</button>
                        {isAdmin() && (
                          <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Supprimer</button>
                        )}
                      </div>
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
