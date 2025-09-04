import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useOrder } from '../context/OrderContext';

export default function FoodDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useOrder();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`http://localhost:5000/api/foods/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFood(data);
        } else {
          const all = await fetch('http://localhost:5000/api/foods').then(r => r.json());
          const found = Array.isArray(all) ? all.find(f => String(f.id) === String(id)) : null;
          setFood(found || null);
        }
      } catch (e) {
        console.error('Erro ao carregar produto:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" />
        <p className="text-muted mt-3">Carregando produto...</p>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">Produto não encontrado.</p>
        <button className="btn btn-outline-secondary mt-3" onClick={() => nav(-1)}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <main className="flex-grow-1">
        <div className="container py-4">
          <nav className="mb-3">
            <Link to="/" className="btn btn-sm btn-success">
              ← Voltar para Home
            </Link>
          </nav>

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="ratio ratio-4x3 rounded overflow-hidden shadow-sm">
                <img
                  src={food.image || 'https://via.placeholder.com/900x600?text=Produto'}
                  alt={food.name}
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <h2 className="fw-bold">{food.name}</h2>
              {typeof food.price !== 'undefined' && (
                <div className="h4 text-success fw-semibold mb-2">R$ {Number(food.price).toFixed(2)}</div>
              )}
              {food.description && <p className="text-muted">{food.description}</p>}

              <ul className="list-unstyled small text-muted">
                {food.category && <li><strong>Categoria:</strong> {food.category}</li>}
                {Array.isArray(food.tags) && food.tags.length > 0 && (
                  <li><strong>Tags:</strong> {food.tags.join(', ')}</li>
                )}
                {food.restaurantName && <li><strong>Restaurante:</strong> {food.restaurantName}</li>}
              </ul>

              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-success"
                  onClick={() =>
                    addItem({
                      id: food.id,
                      name: food.name,
                      price: Number(food.price) || 0,
                      image: food.image,
                      restaurantName: food.restaurantName || food.restaurant,
                    }, 1)
                  }
                >
                  Adicionar ao Pedido
                </button>
                <button className="btn btn-outline-secondary" onClick={() => nav(-1)}>Voltar</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
