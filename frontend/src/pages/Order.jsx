import React from 'react';
import { Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import Footer from '../components/Footer';

export default function Order() {
  const { items, addItem, decrementItem, removeItem, clearOrder, total, count } = useOrder();

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <main className="flex-grow-1">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">Seu Pedido</h2>
            <span className="text-muted small">{count} item(ns)</span>
          </div>

          {!items.length ? (
            <div className="text-center py-5">
              <p className="text-muted mb-3">Seu pedido está vazio.</p>
              <Link to="/" className="btn btn-success">Explorar comidas</Link>
            </div>
          ) : (
            <>
              <div className="row g-3">
                {items.map((it) => (
                  <div key={it.id} className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body d-flex align-items-center gap-3">
                        <img
                          src={it.image || 'https://via.placeholder.com/120x90?text=Item'}
                          alt={it.name}
                          style={{ width: 96, height: 72, objectFit: 'cover', borderRadius: 8 }}
                        />
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <h6 className="mb-1">{it.name}</h6>
                            <strong>R$ {(Number(it.price) * it.qty).toFixed(2)}</strong>
                          </div>
                          <div className="text-muted small">
                            {it.restaurantName || it.restaurant || '—'}
                          </div>
                          <div className="d-flex align-items-center gap-2 mt-2">
                            <button className="btn btn-outline-secondary btn-sm"
                              onClick={() => decrementItem(it.id)}>-</button>
                            <span className="px-2">{it.qty}</span>
                            <button className="btn btn-outline-secondary btn-sm"
                              onClick={() => addItem(it, 1)}>+</button>
                            <button className="btn btn-link text-danger ms-2 p-0"
                              onClick={() => removeItem(it.id)}>Remover</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card border-0 shadow-sm mt-4">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Total</h5>
                  <h5 className="mb-0 text-success">R$ {total.toFixed(2)}</h5>
                </div>
              </div>

              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-outline-secondary" onClick={clearOrder}>Esvaziar</button>
                <button className="btn btn-success">Finalizar pedido</button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
