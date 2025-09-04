// frontend/src/pages/Users.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <main className="flex-grow-1">
        <div className="container py-5">
          <h1 className="text-center mb-5">Usuários</h1>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success"></div>
              <p className="mt-3 text-muted">Carregando usuários...</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
              {users.map((user) => (
                <div key={user.id} className="col">
                  <div className="card h-100 shadow-sm user-card border-0">
                    <div className="card-body text-center">
                      {/* Avatar */}
                      <div className="avatar bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                        {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                      </div>

                      <h5 className="fw-bold">{user.name}</h5>
                      <p className="text-muted small">{user.email}</p>

                      {user.role && (
                        <span className="badge bg-secondary">{user.role}</span>
                      )}

                      <div className="mt-3">
                        <Link
                          to={`/users/${user.id}`}
                          className="btn btn-outline-success btn-sm rounded-pill"
                        >
                          Ver perfil
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="text-center py-5 text-muted">
                  Nenhum usuário encontrado
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        .user-card {
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .user-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
        }
        .avatar {
          width: 70px;
          height: 70px;
          font-size: 1.5rem;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Users;
