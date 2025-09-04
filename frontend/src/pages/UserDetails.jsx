import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function UserDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          const all = await fetch('http://localhost:5000/api/users').then(r => r.json());
          const found = all.find(u => String(u.id) === String(id));
          setUser(found || null);
        }
      } catch (e) {
        console.error("Erro ao carregar usuário:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success"></div>
        <p className="text-muted mt-3">Carregando usuário...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">Usuário não encontrado.</p>
        <button className="btn btn-outline-secondary mt-3" onClick={() => nav(-1)}>Voltar</button>
      </div>
    );
  }

  // saldo pode vir como string "127.23" em `saldo` ou número em `balance`
  const saldoValue = user.saldo ?? user.balance; 
  const hasSaldo = saldoValue !== undefined && saldoValue !== null && saldoValue !== '';
  const saldoFmt = hasSaldo ? Number(saldoValue).toFixed(2) : null;

  return (
    <div className="container py-4">
      <nav className="mb-3">
        <Link to="/users" className="btn btn-sm btn-success">← Voltar para lista</Link>
      </nav>

      <div className="card shadow-sm border-0">
        <div className="card-body text-center">

          {/* Foto ou inicial */}
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="rounded-circle mx-auto d-block mb-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: "100px", height: "100px", fontSize: "2rem", fontWeight: "bold" }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
          )}

          <h3 className="fw-bold">{user.name}</h3>
          <p className="text-muted">{user.email}</p>

          {user.role && <span className="badge bg-secondary mb-2">{user.role}</span>}

          {/* Saldo */}
          {hasSaldo && (
            <div className="h5 text-success fw-semibold mt-2">
              Saldo: R$ {saldoFmt}
            </div>
          )}

          {/* Outras infos */}
          <ul className="list-unstyled mt-3 text-muted small">
            {user.phone && <li><strong>Telefone:</strong> {user.phone}</li>}
            {user.address && <li><strong>Endereço:</strong> {user.address}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
