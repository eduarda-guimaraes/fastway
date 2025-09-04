import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useOrder } from '../context/OrderContext';

export default function UserDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { items, total, count } = useOrder();

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
        <button className="btn btn-outline-secondary mt-3" onClick={() => nav(-1)}>
          Voltar
        </button>
      </div>
    );
  }

  const saldoValue = user.saldo ?? user.balance; 
  const hasSaldo = saldoValue !== undefined && saldoValue !== null && saldoValue !== '';
  const saldoFmt = hasSaldo ? Number(saldoValue).toFixed(2) : null;

  return (
    <div className="min-vh-100 d-flex flex-column">
      <main className="flex-grow-1">
        <div className="container py-4">
          <nav className="mb-3">
            <Link to="/users" className="btn btn-sm btn-success">← Voltar para lista</Link>
          </nav>

          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
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

              {hasSaldo && (
                <div className="h5 text-success fw-semibold mt-2">
                  Saldo: R$ {saldoFmt}
                </div>
              )}

              <ul className="list-unstyled mt-3 text-muted small">
                {user.phone && <li><strong>Telefone:</strong> {user.phone}</li>}
                {user.address && <li><strong>Endereço:</strong> {user.address}</li>}
              </ul>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Meu Pedido</h5>
                <span className="text-muted small">{count} item(ns)</span>
              </div>

              {!items.length ? (
                <p className="text-muted mb-2">Você ainda não adicionou itens.</p>
              ) : (
                <>
                  <ul className="list-unstyled mb-2">
                    {items.slice(0, 5).map((it) => (
                      <li key={it.id} className="d-flex justify-content-between small">
                        <span>{it.qty}× {it.name}</span>
                        <span>R$ {(Number(it.price) * it.qty).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  {items.length > 5 && (
                    <div className="text-muted small mb-2">…e mais {items.length - 5} item(ns)</div>
                  )}
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>Total</strong>
                    <strong className="text-success">R$ {total.toFixed(2)}</strong>
                  </div>
                </>
              )}

              <div className="d-grid mt-3">
                <Link to="/pedido" className="btn btn-success btn-sm">Ver detalhes do pedido</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
