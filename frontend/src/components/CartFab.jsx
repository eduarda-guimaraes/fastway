import { Link } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

function formatBRL(n) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(n || 0));
}

export default function CartFab() {
  const { count, total } = useOrder();
  if (count === 0) return null;

  return (
    <Link
      to="/pedido"
      className="cart-fab position-fixed d-flex align-items-center justify-content-center gap-2 shadow"
      style={{
        bottom: 16,
        right: 16,
        background: "#198754",
        color: "#fff",
        textDecoration: "none",
        borderRadius: 9999,
        zIndex: 1030,
        padding: "10px 18px",
        fontWeight: 500,
      }}
      aria-label="Ir para o pedido"
      title="Ir para o pedido"
    >
      <i className="bi bi-bag-check" />
      <span>{count} item(s)</span>
      <strong>• {formatBRL(total)}</strong>
    </Link>
  );
}
