import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import Footer from '../components/Footer';

const AFTER_CHECKOUT_PATH = "/";

const toBRL = (n) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(n||0));
const maskCard = (v) =>
  v.replace(/\D/g, "").slice(0,16).replace(/(\d{4})(?=\d)/g, "$1 ").trim();
const maskMMYY = (v) =>
  v.replace(/\D/g, "").slice(0,4).replace(/(\d{2})(\d{0,2})/, (m,a,b)=> b ? `${a}/${b}` : a);
const maskCVV = (v) => v.replace(/\D/g, "").slice(0,4);

export default function Order() {
  const {
    items, addItem, decrementItem, removeItem, clearOrder,
    subtotal, deliveryFee, discount, total,
    meta, setMeta, count
  } = useOrder();

  const nav = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [pay, setPay] = useState(() => ({
    pixKey: "fastway-pedidos@exemplo.com",
    dinheiroValor: "",
    dinheiroPrecisaTroco: false,
    cartaoEntrega: true,     
    cartaoNome: "",
    cartaoNumero: "",
    cartaoValidade: "",
    cartaoCVV: ""
  }));

  const troco = useMemo(() => {
    const v = Number(pay.dinheiroValor.toString().replace(",", "."));
    const diff = v - total;
    return isFinite(diff) ? Math.max(0, diff) : 0;
  }, [pay.dinheiroValor, total]);

  const resumoPedido = useMemo(() => {
    const linhas = [
      "Pedido confirmado! ✅",
      `Itens: ${count}`,
      `Total: ${toBRL(total)}`,
      `Pagamento: ${meta.payment.toUpperCase()}`,
      meta.payment === "dinheiro" && pay.dinheiroPrecisaTroco ? `Troco: ${toBRL(troco)}` : "",
      meta.payment === "pix" ? `PIX: ${pay.pixKey}` : "",
      meta.payment === "cartao" ? (pay.cartaoEntrega ? "Cartão na entrega" : "Cartão online") : "",
      meta.deliveryMethod === "delivery" ? `Entrega: ${toBRL(deliveryFee)}` : "Retirada na loja",
      meta.coupon ? `Cupom aplicado: ${meta.coupon}` : "",
      meta.note ? `Obs.: ${meta.note}` : ""
    ].filter(Boolean);
    return linhas.join("\n");
  }, [count, total, meta.payment, pay, troco, meta.deliveryMethod, deliveryFee, meta.coupon, meta.note]);

  function handleCheckout() {
    if (meta.deliveryMethod === "delivery" && !meta.address.trim()) {
      alert("Informe o endereço para entrega.");
      return;
    }
    if (meta.payment === "dinheiro") {
      const val = Number(pay.dinheiroValor.toString().replace(",", "."));
      if (!val || val < total) {
        alert("Informe um valor em dinheiro igual ou maior que o total.");
        return;
      }
    }
    if (meta.payment === "cartao" && !pay.cartaoEntrega) {
      if (!pay.cartaoNome.trim() || pay.cartaoNumero.replace(/\D/g,"").length < 13 || pay.cartaoValidade.length < 4 || pay.cartaoCVV.length < 3) {
        alert("Preencha os dados do cartão corretamente.");
        return;
      }
    }
    setShowModal(true);
  }

  function handleConfirmarModal() {
    clearOrder();
    setShowModal(false);
    nav(AFTER_CHECKOUT_PATH);
  }

  function handleFecharModal() { setShowModal(false); }
  function onKeyDown(e) { if (e.key === 'Escape') setShowModal(false); }

  const payColors = { pix: '#198754', dinheiro: '#ffc107', cartao: '#084298' };
  const payStyle = (key) => {
    const active = meta.payment === key;
    const c = payColors[key];
    return active
      ? { backgroundColor: c, borderColor: c, color: '#fff', borderWidth: 2, borderRadius: 9999 }
      : { backgroundColor: 'transparent', borderColor: c, color: c, borderWidth: 2, borderRadius: 9999 };
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light" onKeyDown={onKeyDown} tabIndex={-1}>
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
                            <strong>{toBRL((Number(it.price) || 0) * it.qty)}</strong>
                          </div>
                          <div className="text-muted small">
                            {it.restaurantName || it.restaurant || '—'}
                          </div>

                          <div className="d-flex align-items-center gap-2 mt-2">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => decrementItem(it.id)}>-</button>
                            <span className="px-2">{it.qty}</span>
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => addItem(it, 1)}>+</button>
                            <button
                              className="btn ms-2"
                              style={{ padding: '4px 12px', backgroundColor: '#dc3545', borderColor: '#dc3545', color: '#fff', borderWidth: 2, borderRadius: 9999 }}
                              onClick={() => removeItem(it.id)}
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row g-3 mt-3">
                <div className="col-12 col-lg-8">
                  <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body">
                      <h5 className="mb-3">Entrega</h5>
                      <div className="d-flex gap-3 mb-3">
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="deliveryMethod" id="opt-delivery"
                            checked={meta.deliveryMethod === "delivery"}
                            onChange={() => setMeta(m => ({ ...m, deliveryMethod: "delivery" }))}/>
                          <label className="form-check-label" htmlFor="opt-delivery">
                            Entrega ({toBRL(deliveryFee)})
                          </label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="deliveryMethod" id="opt-pickup"
                            checked={meta.deliveryMethod === "retirada"}
                            onChange={() => setMeta(m => ({ ...m, deliveryMethod: "retirada" }))}/>
                          <label className="form-check-label" htmlFor="opt-pickup">Retirar no local (Grátis)</label>
                        </div>
                      </div>

                      {meta.deliveryMethod === "delivery" && (
                        <input className="form-control" placeholder="Endereço completo"
                          value={meta.address}
                          onChange={e => setMeta(m => ({ ...m, address: e.target.value }))}/>
                      )}
                    </div>
                  </div>

                  <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body">
                      <h5 className="mb-3">Pagamento</h5>
                      <div className="row g-2 mb-3">
                        <div className="col-12 col-md-4">
                          <button className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                            style={payStyle('pix')}
                            onClick={() => setMeta(m => ({ ...m, payment: "pix" }))}
                            aria-pressed={meta.payment === "pix"}>
                            <i className="bi bi-qr-code-scan" /><span>PIX</span>
                          </button>
                        </div>
                        <div className="col-12 col-md-4">
                          <button className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                            style={payStyle('dinheiro')}
                            onClick={() => setMeta(m => ({ ...m, payment: "dinheiro" }))}
                            aria-pressed={meta.payment === "dinheiro"}>
                            <i className="bi bi-cash-coin" /><span>Dinheiro</span>
                          </button>
                        </div>
                        <div className="col-12 col-md-4">
                          <button className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                            style={payStyle('cartao')}
                            onClick={() => setMeta(m => ({ ...m, payment: "cartao" }))}
                            aria-pressed={meta.payment === "cartao"}>
                            <i className="bi bi-credit-card" /><span>Cartão</span>
                          </button>
                        </div>
                      </div>
                      {meta.payment === "pix" && (
                        <div className="border rounded p-3">
                          <label className="form-label mb-1">Chave PIX</label>
                          <div className="input-group mb-3">
                            <input className="form-control" value={pay.pixKey}
                                   onChange={e => setPay(p => ({ ...p, pixKey: e.target.value }))}/>
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => { navigator.clipboard?.writeText(pay.pixKey); }}
                            >
                              Copiar
                            </button>
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            <div className="rounded bg-light d-flex align-items-center justify-content-center"
                                 style={{ width: 120, height: 120, border: "1px dashed #adb5bd" }}>
                              <i className="bi bi-qr-code" style={{ fontSize: 48 }} />
                            </div>
                            <small className="text-muted">
                              Após confirmar, mostraremos o QR com o valor de {toBRL(total)}.
                            </small>
                          </div>
                        </div>
                      )}

                      {meta.payment === "dinheiro" && (
                        <div className="border rounded p-3">
                          <div className="row g-2">
                            <div className="col-12 col-sm-6">
                              <label className="form-label mb-1">Vai pagar com quanto?</label>
                              <input
                                className="form-control"
                                placeholder={toBRL(total)}
                                inputMode="decimal"
                                value={pay.dinheiroValor}
                                onChange={e => setPay(p => ({ ...p, dinheiroValor: e.target.value }))}
                              />
                            </div>
                            <div className="col-12 col-sm-6 d-flex align-items-end">
                              <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="troco-switch"
                                  checked={pay.dinheiroPrecisaTroco}
                                  onChange={e => setPay(p => ({ ...p, dinheiroPrecisaTroco: e.target.checked }))}/>
                                <label className="form-check-label" htmlFor="troco-switch">Precisa de troco?</label>
                              </div>
                            </div>
                          </div>
                          {pay.dinheiroPrecisaTroco && (
                            <div className="mt-2 small">
                              Troco: <strong>{toBRL(troco)}</strong>
                            </div>
                          )}
                        </div>
                      )}

                      {meta.payment === "cartao" && (
                        <div className="border rounded p-3">
                          <div className="d-flex gap-3 mb-3 flex-wrap">
                            {(() => {
                              const btnBase = {
                                backgroundColor: "transparent",
                                borderRadius: 9999,
                                padding: "8px 16px",
                              };
                              const activeRing = 3; 
                              const idleRing = 2;

                              const entregaActive = pay.cartaoEntrega;
                              const onlineActive  = !pay.cartaoEntrega;

                              return (
                                <>
                                  <button
                                    className="btn"
                                    onClick={() => setPay(p => ({ ...p, cartaoEntrega: true }))}
                                    style={{
                                      ...btnBase,
                                      color: "#198754",
                                      border: `${entregaActive ? activeRing : idleRing}px solid #198754`,
                                    }}
                                  >
                                    Na entrega (maquininha)
                                  </button>

                                  <button
                                    className="btn"
                                    onClick={() => setPay(p => ({ ...p, cartaoEntrega: false }))}
                                    style={{
                                      ...btnBase,
                                      color: "#084298",
                                      border: `${onlineActive ? activeRing : idleRing}px solid #084298`,
                                    }}
                                  >
                                    Online agora
                                  </button>
                                </>
                              );
                            })()}
                          </div>

                          {pay.cartaoEntrega ? (
                            <small className="text-muted">
                              O entregador levará a maquininha. Aceitamos crédito e débito.
                            </small>
                          ) : (
                            <>
                              <div className="row g-2">
                                <div className="col-12">
                                  <label className="form-label mb-1">Nome impresso no cartão</label>
                                  <input
                                    className="form-control"
                                    value={pay.cartaoNome}
                                    onChange={e => setPay(p => ({ ...p, cartaoNome: e.target.value }))}
                                  />
                                </div>
                                <div className="col-12">
                                  <label className="form-label mb-1">Número do cartão</label>
                                  <input
                                    className="form-control"
                                    value={pay.cartaoNumero}
                                    onChange={e => setPay(p => ({ ...p, cartaoNumero: e.target.value.replace(/\D/g,"").slice(0,16).replace(/(\d{4})(?=\d)/g,"$1 ").trim() }))}
                                  />
                                </div>
                                <div className="col-6 col-sm-4">
                                  <label className="form-label mb-1">Validade (MM/AA)</label>
                                  <input
                                    className="form-control"
                                    value={pay.cartaoValidade}
                                    onChange={e => setPay(p => ({ ...p, cartaoValidade: e.target.value.replace(/\D/g,"").slice(0,4).replace(/(\d{2})(\d{0,2})/, (m,a,b)=> b ? `${a}/${b}` : a) }))}
                                  />
                                </div>
                                <div className="col-6 col-sm-4">
                                  <label className="form-label mb-1">CVV</label>
                                  <input
                                    className="form-control"
                                    value={pay.cartaoCVV}
                                    onChange={e => setPay(p => ({ ...p, cartaoCVV: e.target.value.replace(/\D/g,"").slice(0,4) }))}
                                  />
                                </div>
                              </div>
                              <small className="text-muted d-block mt-2">
                                Seus dados não serão enviados agora — isso é apenas uma simulação de UI.
                              </small>
                            </>
                          )}
                        </div>
                      )}

                    </div>
                  </div>

                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <h5 className="mb-3">Observações</h5>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Ex.: tirar cebola, ponto da carne, etc."
                        value={meta.note}
                        onChange={e => setMeta(m => ({ ...m, note: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <h5 className="mb-3">Resumo</h5>

                      <div className="input-group input-group-sm mb-2">
                        <span className="input-group-text">Cupom</span>
                        <input
                          className="form-control"
                          placeholder="DESCONTO10"
                          value={meta.coupon}
                          onChange={e => setMeta(m => ({ ...m, coupon: e.target.value }))}
                        />
                      </div>

                      <div className="d-flex justify-content-between small mb-1">
                        <span>Subtotal</span>
                        <span>{toBRL(subtotal)}</span>
                      </div>
                      <div className="d-flex justify-content-between small mb-1">
                        <span>Entrega</span>
                        <span>{deliveryFee === 0 ? "Grátis" : toBRL(deliveryFee)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="d-flex justify-content-between small mb-1 text-success">
                          <span>Desconto</span>
                          <span>- {toBRL(discount)}</span>
                        </div>
                      )}
                      <hr />
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Total</h5>
                        <h5 className="mb-0 text-success">{toBRL(total)}</h5>
                      </div>

                      <div className="d-grid gap-2 mt-3">
                        <button
                          className="btn"
                          onClick={handleCheckout}
                          style={{ backgroundColor: '#14532d', borderColor: '#14532d', color: '#fff', borderRadius: 9999 }}
                        >
                          Finalizar pedido
                        </button>
                        <button
                          className="btn"
                          onClick={clearOrder}
                          style={{ backgroundColor: 'transparent', color: '#dc3545', border: '2px solid #dc3545', borderRadius: 9999 }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dc3545'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#dc3545'; }}
                        >
                          Esvaziar
                        </button>
                      </div>
                      <div className="d-grid mt-2">
                        <Link
                          to="/"
                          className="btn"
                          style={{ backgroundColor: 'transparent', color: '#198754', border: '2px solid #198754', borderRadius: 9999, textDecoration: 'none' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#198754'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#198754'; }}
                        >
                          Adicionar mais itens
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 1050 }}
          onClick={handleFecharModal}
        >
          <div className="card shadow-lg" style={{ maxWidth: 520, width: '92%' }} onClick={(e) => e.stopPropagation()}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h5 className="mb-0">Pedido confirmado</h5>
                <button className="btn btn-sm btn-light" onClick={handleFecharModal} aria-label="Fechar" title="Fechar">
                  <i className="bi bi-x-lg" />
                </button>
              </div>
              <p className="text-muted mb-3" style={{ whiteSpace: 'pre-wrap' }}>{resumoPedido}</p>
              <div className="d-flex gap-2">
                <button className="btn btn-success flex-grow-1" onClick={handleConfirmarModal}>Ir agora</button>
                <button className="btn btn-outline-secondary" onClick={handleFecharModal}>Continuar aqui</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
