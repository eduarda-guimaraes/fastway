// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-white min-vh-100">
      <div className="container py-5">
        {/* Seção de boas-vindas */}
        <div className="text-center mb-5">
          <h1 className="display-4 text-dark mb-4">Bem-vindo ao FastWay!</h1>
          <p className="lead text-muted">
            O seu delivery de comida rápida e eficiente. Encontre restaurantes, escolha sua comida e faça o pedido rapidamente.
          </p>
        </div>

        {/* Cards de Navegação */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {/* Card de Usuários */}
          <div className="col">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h2 className="h5 text-dark mb-4">Usuários</h2>
                <p className="text-muted mb-4">Gerencie os usuários do sistema e visualize o seu perfil.</p>
                <Link
                  to="/users"
                  className="btn btn-success"
                >
                  Ver Usuários
                </Link>
              </div>
            </div>
          </div>

          {/* Card de Restaurantes */}
          <div className="col">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h2 className="h5 text-dark mb-4">Restaurantes</h2>
                <p className="text-muted mb-4">Encontre restaurantes próximos e veja seus cardápios.</p>
                <Link
                  to="/restaurants"
                  className="btn btn-success"
                >
                  Ver Restaurantes
                </Link>
              </div>
            </div>
          </div>

          {/* Card de Comidas */}
          <div className="col">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h2 className="h5 text-dark mb-4">Comidas</h2>
                <p className="text-muted mb-4">Escolha os alimentos disponíveis nos restaurantes.</p>
                <Link
                  to="/foods"
                  className="btn btn-success"
                >
                  Ver Comidas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
