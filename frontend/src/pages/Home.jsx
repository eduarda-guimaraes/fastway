// frontend/src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // estado da busca (sincroniza com ?q= na URL)
  const [q, setQ] = useState(() => {
    const usp = new URLSearchParams(window.location.search);
    return usp.get('q') ?? '';
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantsResponse, foodsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/restaurants'),
          fetch('http://localhost:5000/api/foods'),
        ]);
        const [restaurantsData, foodsData] = await Promise.all([
          restaurantsResponse.json(),
          foodsResponse.json(),
        ]);
        setRestaurants(Array.isArray(restaurantsData) ? restaurantsData : []);
        setFoods(Array.isArray(foodsData) ? foodsData : []);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // atualiza ?q= na URL
  useEffect(() => {
    const usp = new URLSearchParams(window.location.search);
    if (q) usp.set('q', q);
    else usp.delete('q');
    window.history.replaceState(null, '', `/?${usp.toString()}`);
  }, [q]);

  // sincroniza estado quando navegar pelo histórico
  useEffect(() => {
    const onPop = () => {
      const usp = new URLSearchParams(window.location.search);
      setQ(usp.get('q') ?? '');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // normalizador + filtro
  const norm = (s) => (s || '').toString().toLowerCase();
  const matchesQuery = (item) => {
    if (!q) return true;
    const needle = norm(q);
    const hay = [
      item.name,
      item.description,
      item.cuisine,
      item.category,
      ...(Array.isArray(item.tags) ? item.tags : []),
    ]
      .filter(Boolean)
      .map(norm)
      .join(' ');
    return hay.includes(needle);
  };

  const filteredRestaurants = useMemo(
    () => restaurants.filter(matchesQuery),
    [restaurants, q]
  );

  const filteredFoods = useMemo(
    () => foods.filter(matchesQuery),
    [foods, q]
  );

  const isEmptySearch = !loading && !filteredRestaurants.length && !filteredFoods.length;

  return (
    <div className="bg-white min-vh-100">
      <div className="container py-4">
        {/* Promoção */}
        <div className="promo-section text-center text-white rounded p-5 mb-5 position-relative">
          <h2 className="display-5 fw-bold mb-3">Promoção Especial</h2>
          <h4 className="fw-semibold">Super Combo Burger + Batata + Refri</h4>
          <p className="fs-3 text-warning fw-bold">R$ 19,90</p>
          <p className="lead text-white-50">Aproveite essa oferta incrível em nossos restaurantes!</p>
        </div>

        {/* Busca */}
        <div className="text-center mb-4">
          <div className="search-container mx-auto">
            <span className="search-icon">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="form-control form-control-lg rounded-pill ps-5"
              placeholder="O que você quer comer hoje?"
              aria-label="Campo de busca por restaurantes e alimentos"
            />
          </div>
          {q && (
            <div className="mt-3 small text-muted">
              <span className="badge text-bg-light">busca: “{q}”</span>
            </div>
          )}
        </div>

        {/* Restaurantes */}
        <div className="mb-5">
          <div className="d-flex align-items-baseline justify-content-between mb-3">
            <h3 className="mb-0">Restaurantes Populares</h3>
            {!loading && (
              <span className="text-muted small">
                {filteredRestaurants.length} resultado(s)
              </span>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" />
              <p className="mt-3 text-muted">Carregando restaurantes...</p>
            </div>
          ) : filteredRestaurants.length ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
              {filteredRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="col">
                  <Link
                    to={`/restaurants/${restaurant.id}`}
                    className="text-decoration-none text-reset"
                  >
                    <div className="card h-100 shadow-sm border-0 restaurant-card">
                      <img
                        src={restaurant.image || 'https://via.placeholder.com/600x400?text=Restaurante'}
                        alt={restaurant.name}
                        className="card-img-top restaurant-img"
                        loading="lazy"
                      />
                      <div className="card-body text-center">
                        <h6 className="fw-semibold mb-1">{restaurant.name}</h6>
                        {restaurant.description && (
                          <p className="text-muted small mb-2">{restaurant.description}</p>
                        )}
                        <div className="d-flex gap-2 justify-content-center align-items-center">
                          {restaurant.cuisine && (
                            <span className="badge text-bg-light">{restaurant.cuisine}</span>
                          )}
                          <span className="badge bg-success">
                            Entrega em {restaurant.deliveryTime || '20-40 min'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted">Nenhum restaurante encontrado.</div>
          )}
        </div>

        {/* Alimentos */}
        <div className="mb-5">
          <div className="d-flex align-items-baseline justify-content-between mb-3">
            <h3 className="mb-0">Alimentos</h3>
            {!loading && (
              <span className="text-muted small">{filteredFoods.length} resultado(s)</span>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" />
              <p className="mt-3 text-muted">Carregando alimentos...</p>
            </div>
          ) : filteredFoods.length ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {filteredFoods.map((food) => (
                <div key={food.id} className="col">
                  <Link to={`/foods/${food.id}`} className="text-decoration-none text-reset">
                    <div className="card h-100 shadow-sm border-0 food-card">
                      <div className="position-relative">
                        <img
                          src={food.image || 'https://via.placeholder.com/600x400?text=Comida'}
                          alt={food.name}
                          className="card-img-top food-img"
                          loading="lazy"
                        />
                        {typeof food.price !== 'undefined' && (
                          <span className="badge bg-success position-absolute top-0 end-0 m-2 px-2 py-1">
                            R$ {Number(food.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="card-body text-center">
                        <h6 className="fw-semibold mb-1">{food.name}</h6>
                        {food.description && (
                          <p className="text-muted small mb-0">{food.description}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted">Nenhum alimento encontrado.</div>
          )}
        </div>

        {isEmptySearch && (
          <div className="text-center text-muted">
            Nada encontrado para sua busca. Tente outros termos. 🙂
          </div>
        )}
      </div>

      <Footer />

      <style>{`
        .promo-section {
          background: url('/promocao.jpg') center/cover no-repeat;
        }
        .promo-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.55);
        }
        .promo-section * { position: relative; z-index: 1; }

        .restaurant-card, .food-card {
          border-radius: 12px;
          transition: all 0.25s ease;
        }
        .restaurant-card:hover, .food-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
        }
        .restaurant-img, .food-img {
          height: 150px;
          object-fit: cover;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
        .search-container {
          position: relative;
          width: min(720px, 100%);
        }
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
