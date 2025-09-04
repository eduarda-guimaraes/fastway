import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const OrderCtx = createContext();

const STORAGE_KEY = 'fastway:order';

export function OrderProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => String(i.id) === String(item.id));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { ...item, qty }];
    });
  };

  const decrementItem = (id, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => String(i.id) === String(id));
      if (idx < 0) return prev;
      const cur = prev[idx];
      const newQty = cur.qty - qty;
      if (newQty <= 0) return prev.filter((i) => String(i.id) !== String(id));
      const copy = [...prev];
      copy[idx] = { ...cur, qty: newQty };
      return copy;
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => String(i.id) !== String(id)));
  const clearOrder = () => setItems([]);

  const { count, total } = useMemo(() => {
    const count = items.reduce((acc, i) => acc + i.qty, 0);
    const total = items.reduce((acc, i) => acc + (Number(i.price) || 0) * i.qty, 0);
    return { count, total };
  }, [items]);

  const value = { items, addItem, decrementItem, removeItem, clearOrder, count, total };
  return <OrderCtx.Provider value={value}>{children}</OrderCtx.Provider>;
}

export function useOrder() {
  return useContext(OrderCtx);
}
