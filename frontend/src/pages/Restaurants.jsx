import React, { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';

const INLINE_CSS_ID = 'restaurants-inline-styles';
const CSS_TEXT = `
  .bg-success-subtle { background-color: #f0f9f4; }
  .badge-soft-success { background: rgba(25, 135, 84, 0.1); color: #198754; }
  .badge-soft-dark { background: rgba(33, 37, 41, 0.1); color: #212529; }

  .chip {
    font-size: 0.7rem;
    padding: 0.3rem 0.7rem;
    border-radius: 12px;
    background: #f8f9fa;
  }
  .chip-success { background: rgba(25, 135, 84, 0.1); color: #198754; }
  .chip-outline-success {
    border: 1px solid #198754;
    color: #198754;
    background: transparent;
  }

  .rest-toolbar { 
    border: 1px solid #dee2e6; 
    background: #fff;
  }

  .rest-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s ease;
    border: 1px solid rgba(0,0,0,0.08);
  }
  .rest-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }

  .rest-thumb { 
    height: 160px; 
    background: #f8f9fa;
    position: relative;
  }
  .object-fit-cover { object-fit: cover; }

  .vr {
    width: 1px; 
    height: 12px;
    background: #dee2e6; 
    display: inline-block;
    margin: 0 8px;
  }
  
  .rating-stars {
    font-size: 0.9rem;
    letter-spacing: 1px;
  }
`;

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [q, setQ] = useState('');
  const [cuisine, setCuisine] = useState('Todos');
  const [sort, setSort] = useState('relevancia');

  useEffect(() => {
    if (!document.getElementById(INLINE_CSS_ID)) {
      const style = document.createElement('style');
      style.id = INLINE_CSS_ID;
      style.innerText = CSS_TEXT;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/restaurants');
        const data = await res.json();
        setRestaurants(data || []);
      } catch (e) {
        console.error('Erro ao buscar restaurantes:', e);
      }
    })();
  }, []);

  const cuisines = useMemo(() => {
    const set = new Set(restaurants.map(r => r.cuisine).filter(Boolean));
    return ['Todos', ...Array.from(set)];
  }, [restaurants]);

  const items = useMemo(() => {
    let list = [...restaurants];

    if (q.trim()) {
      const qq = q.toLowerCase();
      list = list.filter(r =>
        r.name?.toLowerCase().includes(qq) ||
        r.cuisine?.toLowerCase().includes(qq)
      );
    }
    if (cuisine !== 'Todos') {
      list = list.filter(r => r.cuisine === cuisine);
    }
    if (sort === 'tempo') {
      list.sort((a, b) => (a.deliveryTime ?? 999) - (b.deliveryTime ?? 999));
    } else if (sort === 'nome') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return list;
  }, [restaurants, q, cuisine, sort]);

  const Stars = ({ rating }) => {
    const r = Number.isFinite(rating) ? rating : 4;
    const filled = Math.round(r);
    return (
      <span className="rating-stars">
        {'★'.repeat(filled)}
        <span className="text-muted">{'★'.repeat(Math.max(0, 5 - filled))}</span>
      </span>
    );
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="h3 fw-bold text-dark mb-2">Restaurantes</h1>
          <p className="text-muted">Encontre os melhores restaurantes perto de você</p>
        </div>

        {/* Toolbar */}
        <div className="rest-toolbar rounded-3 p-3 mb-4 shadow-sm">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  className="form-control border-start-0"
                  placeholder="Buscar por nome ou cozinha…"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                />
              </div>
            </div>
            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={cuisine}
                onChange={e => setCuisine(e.target.value)}
              >
                {cuisines.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="relevancia">Relevância</option>
                <option value="tempo">Menor tempo</option>
                <option value="nome">A–Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de cards */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {items.length === 0 && (
            <div className="col-12">
              <div className="alert alert-light border text-center py-5">
                <i className="bi bi-search display-4 text-muted d-block mb-3"></i>
                <h5>Nenhum restaurante encontrado</h5>
                <p className="text-muted">Tente ajustar os filtros de busca</p>
              </div>
            </div>
          )}

          {items.map((r, i) => (
            <div key={`${r.id ?? i}`} className="col">
              <article className="card rest-card h-100">
                <div className="rest-thumb position-relative">
                  <img
                    src={r.image || 'https://via.placeholder.com/640x360?text=Restaurant'}
                    alt={r.name}
                    className="w-100 h-100 object-fit-cover"
                  />
                  <span className="badge badge-soft-success position-absolute top-0 start-0 m-2">
                    {r.cuisine || 'Gastronomia'}
                  </span>
                  {r.deliveryTime && (
                    <span className="badge badge-soft-dark position-absolute bottom-0 end-0 m-2">
                      {r.deliveryTime} min
                    </span>
                  )}
                </div>

                <div className="card-body d-flex flex-column p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0 fw-bold">{r.name}</h5>
                    <Stars rating={r.rating} />
                  </div>
                  
                  <div className="d-flex align-items-center small text-secondary mb-2">
                    <span>{r.cuisine || '—'}</span>
                    <span className="vr"></span>
                    <span>{r.distance || '1km'}</span>
                  </div>

                  <div className="mt-auto pt-2">
                    <div className="d-flex gap-2 mb-3">
                      <span className="chip chip-success">Entrega</span>
                      <span className="chip chip-outline-success">Aberto</span>
                    </div>
                    
                    <button className="btn btn-outline-success w-100 btn-sm">
                      Ver cardápio
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Restaurants;