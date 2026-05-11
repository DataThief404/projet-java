import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ produits: 0, lowStock: 0, mouvements: 0, users: 0, entrees: 0, sorties: 0 });
  const [recentMouvements, setRecentMouvements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, stockRes] = await Promise.all([
          api.get('/produits'),
          api.get('/stock'),
        ]);
        const produits = prodRes.data;
        const mouvements = stockRes.data;
        const lowStock = produits.filter(p => p.quantiteStock < 5).length;
        const entrees = mouvements.filter(m => m.type === 'ENTREE').length;
        const sorties = mouvements.filter(m => m.type === 'SORTIE').length;

        let users = 0;
        if (isAdmin()) {
          const usersRes = await api.get('/admin/users');
          users = usersRes.data.length;
        }

        setStats({ produits: produits.length, lowStock, mouvements: mouvements.length, users, entrees, sorties });
        setRecentMouvements(mouvements.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Vue d'ensemble de votre stock</p>
        </div>

        {loading ? (
          <p style={{ color: '#999' }}>Chargement...</p>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card" style={{ '--accent': '#c8f060' }}>
                <p className="stat-label">Produits</p>
                <p className="stat-value">{stats.produits}</p>
                <p className="stat-sub">références actives</p>
              </div>
              <div className="stat-card" style={{ '--accent': '#ff6b6b' }}>
                <p className="stat-label">Stock faible</p>
                <p className="stat-value" style={{ color: stats.lowStock > 0 ? '#a32d2d' : '#1a1a1a' }}>
                  {stats.lowStock}
                </p>
                <p className="stat-sub">produits {'<'} 5 unités</p>
              </div>
              <div className="stat-card" style={{ '--accent': '#60c8f0' }}>
                <p className="stat-label">Entrées</p>
                <p className="stat-value" style={{ color: '#2d7a2d' }}>{stats.entrees}</p>
                <p className="stat-sub">mouvements entrants</p>
              </div>
              <div className="stat-card" style={{ '--accent': '#f0a060' }}>
                <p className="stat-label">Sorties</p>
                <p className="stat-value" style={{ color: '#92580a' }}>{stats.sorties}</p>
                <p className="stat-sub">mouvements sortants</p>
              </div>
              {isAdmin() && (
                <div className="stat-card" style={{ '--accent': '#a060f0' }}>
                  <p className="stat-label">Utilisateurs</p>
                  <p className="stat-value">{stats.users}</p>
                  <p className="stat-sub">comptes actifs</p>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => navigate('/produits')}>+ Nouveau produit</button>
              <button className="btn btn-success" onClick={() => navigate('/stock')}>+ Mouvement stock</button>
              <button className="btn btn-ghost" onClick={() => navigate('/categories')}>+ Catégorie</button>
            </div>

            {/* Recent movements */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Derniers mouvements</h3>
                <button className="btn btn-ghost" onClick={() => navigate('/stock')}>Voir tout</button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Type</th>
                      <th>Quantité</th>
                      <th>Motif</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMouvements.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>Aucun mouvement</td></tr>
                    ) : recentMouvements.map(m => (
                      <tr key={m.id}>
                        <td><strong>{m.produit?.nom}</strong></td>
                        <td>
                          <span className={`badge ${m.type === 'ENTREE' ? 'badge-green' : 'badge-red'}`}>
                            {m.type}
                          </span>
                        </td>
                        <td>{m.quantite}</td>
                        <td style={{ color: '#888' }}>{m.motif || '—'}</td>
                        <td style={{ color: '#aaa', fontSize: '12px' }}>
                          {new Date(m.date).toLocaleString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
