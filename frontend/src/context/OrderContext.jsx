import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const OrderContext = createContext(null);

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function OrderProvider({ children }) {
  const [items, setItems] = useState(() => readLS("order.items", []));
  const [meta, setMeta] = useState(() =>
    readLS("order.meta", {
      deliveryMethod: "delivery",  
      address: "",
      payment: "pix",               
      note: "",                    
      coupon: "",
    })
  );

  useEffect(() => writeLS("order.items", items), [items]);
  useEffect(() => writeLS("order.meta", meta), [meta]);

  function addItem(item, qty = 1) {
    setItems(prev => {
      const id = String(item.id);
      const idx = prev.findIndex(p => String(p.id) === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        if (copy[idx].qty <= 0) copy.splice(idx, 1);
        return copy;
      }
      return [...prev, { ...item, qty: Math.max(1, qty) }];
    });
  }

  function decrementItem(id) {
    setItems(prev => {
      const idx = prev.findIndex(p => String(p.id) === String(id));
      if (idx < 0) return prev;
      const copy = [...prev];
      const newQty = copy[idx].qty - 1;
      if (newQty <= 0) copy.splice(idx, 1);
      else copy[idx] = { ...copy[idx], qty: newQty };
      return copy;
    });
  }

  function removeItem(id) { setItems(prev => prev.filter(p => String(p.id) !== String(id))); }
  function clearOrder() { setItems([]); }

  const count = useMemo(() => items.reduce((acc, it) => acc + it.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((acc, it) => acc + (Number(it.price) || 0) * it.qty, 0), [items]);
  const deliveryFee = useMemo(() => (meta.deliveryMethod === "delivery" ? 6.9 : 0), [meta.deliveryMethod]);
  const discount = useMemo(() => {
    if (!meta.coupon) return 0;
    if (meta.coupon.trim().toUpperCase() === "DESCONTO10") return subtotal * 0.1;
    return 0;
  }, [meta.coupon, subtotal]);
  const total = useMemo(() => Math.max(0, subtotal + deliveryFee - discount), [subtotal, deliveryFee, discount]);

  return (
    <OrderContext.Provider
      value={{
        items, addItem, decrementItem, removeItem, clearOrder,
        count, subtotal, deliveryFee, discount, total,
        meta, setMeta,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder deve ser usado dentro de <OrderProvider>");
  return ctx;
}
