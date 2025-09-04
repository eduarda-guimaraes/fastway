import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function RestaurantDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`http://localhost:5000/api/restaurants/${id}`);
        let rData = null;
        if (res.ok) {
          rData = await res.json();
        } else {
          const all = await fetch('http://localhost:5000/api/restaurants').then(r => r.json());
          rData = Array.isArray(all) ? all.find(r => String(r.id) === String(id)) : null;
        }
        setRestaurant(rData || null);

        const foodsAll = await fetch('http://localhost:5000/api/foods').then(r => r.json());
        setFoods(Array.isArray(foodsAll) ? foodsAll : []);
      } catch (e) {
        console.error('Erro ao carregar detalhes do restaurante:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const menuFoods = useMemo(() => {
    if (!restaurant) return [];
    const rid = restaurant.id;
    const rname = (restaurant.name || '').toLowerCase();
    return foods.filter(f => {
      if (typeof f.restaurantId !== 'undefined') return String(f.restaurantId) === String(rid);
      if (f.restaurantName) return String(f.restaurantName).toLowerCase() === rname;
      return false;
    });
  }, [foods, restaurant]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" />
        <p className="text-muted mt-3">Carregando restaurante...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">Restaurante não encontrado.</p>
        <button className="btn btn-outline-secondary mt-3" onClick={() => nav(-1)}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <main className="flex-grow-1">
        <div className="container py-4">
          <nav className="mb-3">
            <Link to="/" className="btn btn-sm btn-success">← Voltar para Home</Link>
          </nav>

          {/* Cabeçalho do restaurante */}
          <div className="row g-4 align-items-start">
            <div className="col-12 col-md-5">
              <div className="ratio ratio-4x3 rounded overflow-hidden shadow-sm">
                <img
                  src={restaurant.image || 'https://via.placeholder.com/900x600?text=Restaurante'}
                  alt={restaurant.name}
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
            </div>

            <div className="col-12 col-md-7">
              <h2 className="fw-bold mb-1">{restaurant.name}</h2>

              <div className="d-flex flex-wrap gap-2 mb-3">
                {restaurant.cuisine && <span className="badge text-bg-light">{restaurant.cuisine}</span>}
                {typeof restaurant.rating !== 'undefined' && (
                  <span className="badge text-bg-light">⭐ {Number(restaurant.rating).toFixed(1)}</span>
                )}
                {typeof restaurant.deliveryFee !== 'undefined' && (
                  <span className="badge text-bg-light">
                    Taxa: {Number(restaurant.deliveryFee) === 0 ? 'Grátis' : `R$ ${Number(restaurant.deliveryFee).toFixed(2)}`}
                  </span>
                )}
                <span className="badge bg-success">
                  {restaurant.deliveryTime ? `Entrega em ${restaurant.deliveryTime}` : 'Entrega rápida'}
                </span>
              </div>

              {restaurant.description && <p className="text-muted mb-3">{restaurant.description}</p>}

              <ul className="list-unstyled small text-muted mb-3">
                {restaurant.address && <li><strong>Endereço:</strong> {restaurant.address}</li>}
                {restaurant.phone && <li><strong>Telefone:</strong> {restaurant.phone}</li>}
                {restaurant.openingHours && <li><strong>Horário:</strong> {restaurant.openingHours}</li>}
              </ul>

              <div className="d-flex gap-2">
                <button className="btn btn-success">Iniciar Pedido</button>
                <button className="btn btn-outline-secondary" onClick={() => nav(-1)}>Voltar</button>
              </div>
            </div>
          </div>

          {/* Cardápio */}
          <hr className="my-4" />
          <div className="d-flex align-items-baseline justify-content-between mb-3">
            <h3 className="mb-0">Cardápio</h3>
            <span className="text-muted small">{menuFoods.length} item(ns)</span>
          </div>

          {menuFoods.length ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
              {menuFoods.map((food) => (
                <div key={food.id} className="col">
                  <Link to={`/foods/${food.id}`} className="text-decoration-none text-reset">
                    <div className="card h-100 shadow-sm border-0">
                      <div className="position-relative">
                        <img
                          src={food.image || 'https://via.placeholder.com/600x400?text=Produto'}
                          alt={food.name}
                          className="card-img-top"
                          style={{ height: 160, objectFit: 'cover' }}
                          loading="lazy"
                        />
                        {typeof food.price !== 'undefined' && (
                          <span className="badge bg-success position-absolute top-0 end-0 m-2 px-2 py-1">
                            R$ {Number(food.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="card-body">
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
            <div className="text-muted">Este restaurante ainda não tem itens cadastrados.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
