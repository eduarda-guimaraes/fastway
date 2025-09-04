import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [sort, setSort] = useState('name-asc');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users');
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const roles = useMemo(() => {
    const set = new Set();
    users.forEach(u => u?.role && set.add(u.role));
    return Array.from(set).sort();
  }, [users]);

  const visible = useMemo(() => {
    let arr = [...users];
    if (q.trim()) {
      const term = q.trim().toLowerCase();
      arr = arr.filter(u =>
        (u.name || '').toLowerCase().includes(term) ||
        (u.email || '').toLowerCase().includes(term)
      );
    }
    if (role) arr = arr.filter(u => (u.role || '') === role);

    arr.sort((a, b) => {
      const [field, dir] = sort.split('-');
      const va = (a[field] || '').toString().toLowerCase();
      const vb = (b[field] || '').toString().toLowerCase();
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });

    return arr;
  }, [users, q, role, sort]);

  function clearSearch() {
    setQ('');
  }

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <main className="flex-grow-1">
        <div className="users-hero">
          <div className="container py-5">
            <div className="text-center text-dark">
              <h1 className="display-5 fw-bold mb-2">Usuários</h1>
              <p className="lead mb-0 users-hero-sub">
                Pesquise pessoas da plataforma, filtre por função e veja perfis em destaque.
              </p>
            </div>

            <div className="row g-3 mt-4 justify-content-center">
              <div className="col-12 col-md-6">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-lg users-search"
                    placeholder="Buscar por nome ou e-mail..."
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    aria-label="Buscar usuários"
                  />
                  <span className="search-icon" aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M21 21l-4.35-4.35m1.1-5.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0111.3 8.6z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>
                  {q && (
                    <button
                      type="button"
                      className="clear-btn"
                      onClick={clearSearch}
                      aria-label="Limpar busca"
                      title="Limpar"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className="col-6 col-md-3">
                <select
                  className="form-select form-select-lg users-control"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  <option value="">Todas as funções</option>
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="col-6 col-md-3">
                <select
                  className="form-select form-select-lg users-control"
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                >
                  <option value="name-asc">Nome (A–Z)</option>
                  <option value="name-desc">Nome (Z–A)</option>
                  <option value="email-asc">E-mail (A–Z)</option>
                  <option value="email-desc">E-mail (Z–A)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="container py-5">
          {!loading && visible.length > 0 && (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {visible.map(user => {
                const name = user?.name || 'Sem nome';
                const email = user?.email || 'sem@email';
                const initial = name.charAt(0).toUpperCase() || '?';

                return (
                  <div key={user.id} className="col">
                    <div className="card h-100 shadow-sm border-0 users-card">
                      <div className="card-body p-4 d-flex flex-column text-center">
                        <div
                          className="avatar rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-white"
                          style={{ background: '#198754' }}
                        >
                          {initial}
                        </div>

                        <h5 className="fw-bold text-dark mb-1">{name}</h5>
                        <p className="text-muted small mb-2">{email}</p>

                        <div className="mt-auto pt-3">
                          <Link
                            to={`/users/${user.id}`}
                            className="btn btn-amarillo btn-sm rounded-pill px-3"
                          >
                            Ver perfil
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        .users-hero {
          background: linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 60%, #FFF59D 100%);
          color: #212529;
        }
        .users-hero-sub { color: rgba(33,37,41,.85); }


        .users-search {
          padding-left: 42px;
          padding-right: 40px;
          border-radius: 999px;
          border: none;
          box-shadow: 0 8px 24px rgba(0,0,0,.18);
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }
        .clear-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #6c757d;
          padding: 6px;
          border-radius: 999px;
        }

        .users-card {
          border-radius: 16px;
          background: #fff;
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .users-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(0,0,0,.12);
        }
        .avatar {
          width: 72px;
          height: 72px;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .btn-amarillo {
          background-color: #FFD54F;
          color: #fff; 
          border: 1px solid #f0c13b;
        }
        .btn-amarillo:hover {
          background-color: #FBC02D;
          color: #fff; 
        }
      `}</style>
    </div>
  );
}
